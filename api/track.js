// Vercel serverless: shared live-position store for driver app -> track page.
// GET  /api/track?ref=WKW-...  -> latest ping {lat,lng,speedKph,stage,...} or 404
// POST /api/track {ref,lat,lng,...} -> stores ping (driver app + vendor webhooks)
// NOTE: serverless memory is ephemeral per region/instance. Fine for demo and
// low-volume dispatch; production: replace `store` with Upstash Redis / KV or
// forward to your GPS vendor's API (see README section "Telematics").
const store = globalThis.__wakwaTrackStore || (globalThis.__wakwaTrackStore = new Map());

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const ref = String((req.query && req.query.ref) || "").toUpperCase();
    if (!ref) return json(res, 400, { error: "ref required" });
    const hit = store.get(ref);
    if (!hit) return json(res, 404, { error: "no position yet", ref });
    return json(res, 200, Object.assign({ source: "live" }, hit));
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};
    const ref = String(body.ref || "").toUpperCase();
    if (!ref) return json(res, 400, { error: "ref required" });
    const ping = {
      ref, lat: Number(body.lat), lng: Number(body.lng),
      speedKph: Number(body.speedKph || 0),
      stage: String(body.stage || "In Transit"),
      driver: String(body.driver || ""), truck: String(body.truck || ""),
      note: String(body.note || ""), updatedAt: new Date().toISOString()
    };
    if (!isFinite(ping.lat) || !isFinite(ping.lng)) return json(res, 400, { error: "lat/lng required" });
    store.set(ref, ping);
    return json(res, 200, { ok: true, ref });
  }
  res.setHeader("Allow", "GET, POST");
  return json(res, 405, { error: "method not allowed" });
};
