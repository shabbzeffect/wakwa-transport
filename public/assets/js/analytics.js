/* WAKWA Analytics — GA4 + Meta Pixel + GTM, consent-gated.
 * Owner setup: fill IDs below OR override window.WAKWA_ANALYTICS before site.js runs.
 * Values map 1:1 to .env.example (GA_ID, META_PIXEL_ID, GTM_ID) injected at deploy.
 * This file does nothing until WakwaAnalytics.init() is called (site.js calls it
 * only when localStorage wakwa-consent === 'yes'). No cookies/scripts load on Decline.
 */
window.WAKWA_ANALYTICS = Object.assign(
  { gaId: "", metaPixelId: "", gtmId: "" },
  window.WAKWA_ANALYTICS || {}
);

window.WakwaAnalytics = (function () {
  var loaded = false;

  function loadScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = true;
      if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      s.onload = resolve; s.onerror = function () { reject(new Error("analytics script failed: " + src)); };
      document.head.appendChild(s);
    });
  }

  function initGA4(gaId) {
    // https://developers.google.com/analytics/devguides/collection/ga4
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
    return loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId));
  }

  function initMeta(pixelId) {
    // https://developers.facebook.com/docs/meta-pixel
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    return Promise.resolve();
  }

  function initGTM(gtmId) {
    // https://developers.google.com/tag-manager/quickstart
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    return loadScript(
      "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId),
      { "data-consent": "granted" }
    );
  }

  function init() {
    if (loaded) return Promise.resolve();
    if (localStorage.getItem("wakwa-consent") !== "yes") return Promise.resolve();
    loaded = true;
    var cfg = window.WAKWA_ANALYTICS || {};
    var jobs = [];
    if (cfg.gtmId) jobs.push(initGTM(cfg.gtmId));
    if (cfg.gaId) jobs.push(initGA4(cfg.gaId));
    if (cfg.metaPixelId) {
      jobs.push(initMeta(cfg.metaPixelId));
      var no = document.createElement("noscript");
      no.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' +
        encodeURIComponent(cfg.metaPixelId) + '&ev=PageView&noscript=1"/>';
      document.head.appendChild(no);
    }
    return Promise.allSettled(jobs);
  }

  // Fan-out helper: safe to call anywhere; no-ops until consent + libs load.
  function track(event, params) {
    if (localStorage.getItem("wakwa-consent") !== "yes") return;
    try {
      if (window.gtag && (window.WAKWA_ANALYTICS || {}).gaId) window.gtag("event", event, params || {});
      if (window.fbq && (window.WAKWA_ANALYTICS || {}).metaPixelId) window.fbq("trackCustom", event, params || {});
      if (window.dataLayer) window.dataLayer.push(Object.assign({ event: event }, params || {}));
    } catch (e) { /* analytics must never break the page */ }
  }

  return { init: init, track: track };
})();
