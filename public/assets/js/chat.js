/* WAKWA live-chat slot — Tawk.to / Crisp, consent-gated.
 * Owner setup (pick ONE):
 *   window.WAKWA_CHAT = { provider: 'tawk', tawkSrc: 'https://embed.tawk.to/<PROPERTY_ID>/default' };
 *   window.WAKWA_CHAT = { provider: 'crisp', crispId: '<WEBSITE_ID>' };
 *   window.WAKWA_CHAT = { provider: 'none' };   // default: chat disabled
 * This file does nothing until WakwaChat.load() is called (site.js calls it only
 * when localStorage wakwa-consent === 'yes'). Paste real IDs, never commit secrets
 * beyond the public embed IDs (those are public by design).
 */
window.WAKWA_CHAT = Object.assign(
  { provider: "none", tawkSrc: "", crispId: "" },
  window.WAKWA_CHAT || {}
);

window.WakwaChat = (function () {
  var loaded = false;

  function loadTawk(src) {
    window.Tawk_API = window.Tawk_API || {};
    var s = document.createElement("script");
    s.async = true; s.src = src; s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
    return Promise.resolve();
  }

  function loadCrisp(id) {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = id;
    var s = document.createElement("script");
    s.async = true; s.src = "https://client.crisp.chat/l.js";
    document.head.appendChild(s);
    return Promise.resolve();
  }

  function load() {
    if (loaded) return Promise.resolve();
    if (localStorage.getItem("wakwa-consent") !== "yes") return Promise.resolve();
    var cfg = window.WAKWA_CHAT || { provider: "none" };
    loaded = true;
    if (cfg.provider === "tawk" && cfg.tawkSrc) return loadTawk(cfg.tawkSrc);
    if (cfg.provider === "crisp" && cfg.crispId) return loadCrisp(cfg.crispId);
    return Promise.resolve(); // 'none' or missing IDs: intentionally no-op
  }

  function show() { try {
    if (window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
    if (window.$crisp) window.$crisp.push(["do", "chat:open"]);
  } catch (e) {} }

  return { load: load, show: show };
})();
