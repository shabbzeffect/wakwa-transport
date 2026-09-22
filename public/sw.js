/* WAKWA service worker — offline-first shell for remote sites.
 * Navigations: network-first, fall back to cached homepage.
 * Static assets (css/js/img/content/lib/locales): cache-first with runtime fill.
 * /api/* and cross-origin (tiles, fonts, CDN): network-only, never cached.
 * Bump V to force-refresh all caches after a deploy.
 */
const V = 'wakwa-v2';
const CORE = ['./index.html', './assets/css/styles.css', './assets/js/site.js',
  './content/site.js', './assets/img/favicon.svg', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function isAsset(u) {
  return /\.(css|js|json|png|jpg|jpeg|webp|svg|ico|woff2?)$/.test(u.pathname) &&
    (u.pathname.startsWith('/assets/') || u.pathname.startsWith('/content/') ||
     u.pathname.startsWith('/lib/') || u.pathname.startsWith('/locales/') ||
     u.pathname.startsWith('/tools/'));
}
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // tiles/fonts/CDN untouched
  if (u.pathname.startsWith('/api/')) return; // live data only
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  if (isAsset(u)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(V).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html'))));
  }
});
