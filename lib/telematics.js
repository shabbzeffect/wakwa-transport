/* WAKWA telematics — one interface, three sources (live API → driver bus → sim).
 *
 * How it works on static hosting: the driver app (driver.html) writes GPS pings
 * to localStorage key `wakwa-telemetry:<WAYBILL>`. track.html reads that key,
 * so dispatch demos work with zero backend. On Vercel, both pages also try
 * /api/track (see api/track.js) so driver phone → customer browser works
 * across devices. Production: point endpoint at your telematics provider
 * (GPS vendor webhook) or a KV store — only pushPing()/getPosition() change.
 */
window.WAKWA_TELEMATICS = Object.assign(
  { endpoint: "/api/track", pollMs: 15000, provider: "auto" },
  window.WAKWA_TELEMATICS || {}
);

window.WakwaTelematics = (function () {
  var STAGES = ["Booked", "Loaded", "In Transit", "At Hub", "Out for Delivery", "Delivered"];
  // Demo corridor waypoints (Nairobi → Nakuru → Eldoret) for sim + map fallback.
  var CORRIDOR = [[-1.2921, 36.8219], [-1.05, 36.55], [-0.72, 36.43], [-0.3031, 36.0800], [0.1, 35.7], [0.5143, 35.2698]];

  function busKey(ref) { return "wakwa-telemetry:" + String(ref || "").toUpperCase(); }

  function readBus(ref) {
    try {
      var raw = localStorage.getItem(busKey(ref));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function hashStr(s) {
    s = String(s || "WKW-DEMO"); var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  // Deterministic demo position so WKW-DEMO always shows a plausible moving truck.
  function simPosition(ref) {
    var h = hashStr(ref);
    var legs = CORRIDOR.length - 1;
    var leg = h % legs;
    var frac = ((Date.now() / 120000) + (h % 100) / 100) % 1; // full leg every ~2 min
    var a = CORRIDOR[leg], b = CORRIDOR[leg + 1];
    return {
      source: "sim",
      lat: a[0] + (b[0] - a[0]) * frac,
      lng: a[1] + (b[1] - a[1]) * frac,
      speedKph: 55 + (h % 25),
      stage: STAGES[2 + (h % 2)],
      updatedAt: new Date().toISOString(),
      note: "Simulated position — connect a GPS vendor for live data."
    };
  }

  function apiGet(ref) {
    var cfg = window.WAKWA_TELEMATICS || {};
    if (!cfg.endpoint) return Promise.resolve(null);
    return fetch(cfg.endpoint + "?ref=" + encodeURIComponent(ref), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && j.lat ? Object.assign({ source: "live" }, j) : null; })
      .catch(function () { return null; });
  }

  function getPosition(ref) {
    ref = String(ref || "").toUpperCase();
    return apiGet(ref).then(function (live) {
      if (live) return live;
      var bus = readBus(ref);
      if (bus && bus.lat) return Object.assign({ source: "driver" }, bus);
      var sim = simPosition(ref);
      return sim;
    });
  }

  function pushPing(ref, ping) {
    ref = String(ref || "").toUpperCase();
    var payload = Object.assign({
      ref: ref, updatedAt: new Date().toISOString()
    }, ping || {});
    try { localStorage.setItem(busKey(ref), JSON.stringify(payload)); } catch (e) {}
    var cfg = window.WAKWA_TELEMATICS || {};
    if (cfg.endpoint) {
      fetch(cfg.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(function () {});
    }
    return payload;
  }

  function onBusUpdate(ref, cb) {
    window.addEventListener("storage", function (e) {
      if (e.key === busKey(ref)) {
        try { cb(JSON.parse(e.newValue)); } catch (err) {}
      }
    });
  }

  return { STAGES: STAGES, CORRIDOR: CORRIDOR, getPosition: getPosition,
           pushPing: pushPing, onBusUpdate: onBusUpdate, readBus: readBus };
})();
