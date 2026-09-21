/* WAKWA CMS adapter — Sanity / Contentful drop-in over local content/*.js
 *
 * Default (provider 'local'): zero network, reads the window.WAKWA_* globals
 * the site already ships with. Pages keep working exactly as today.
 *
 * To go headless later, set e.g.:
 *   window.WAKWA_CMS = { provider:'sanity',
 *     sanity:{ projectId:'<PROJECT_ID>', dataset:'production', apiVersion:'2026-01-01' } };
 *   window.WAKWA_CMS = { provider:'contentful',
 *     contentful:{ spaceId:'<SPACE>', environment:'master', token:'<CDA_TOKEN>' } };
 * Env mapping (.env.example): SANITY_PROJECT_ID, SANITY_DATASET,
 * CONTENTFUL_SPACE_ID, CONTENTFUL_ENV, CONTENTFUL_CDA_TOKEN.
 * NOTE: browser-side CMS tokens must be publishable (public dataset / CDA only).
 * For preview drafts or write access, proxy through /api/cms (server keeps secrets).
 *
 * Collections: site | services | fleet | materials | testimonials | faqs |
 *              projects | team | coverage | posts
 */
window.WAKWA_CMS = Object.assign(
  { provider: "local", ttlMs: 5 * 60 * 1000, sanity: null, contentful: null },
  window.WAKWA_CMS || {}
);

window.WakwaCMS = (function () {
  var mem = {}; // collection -> {at, data}

  var LOCAL_MAP = {
    site: "WAKWA_SITE", services: "WAKWA_SERVICES", fleet: "WAKWA_FLEET",
    materials: "WAKWA_MATERIALS", testimonials: "WAKWA_TESTIMONIALS",
    faqs: "WAKWA_FAQS", projects: "WAKWA_PROJECTS", team: "WAKWA_TEAM",
    coverage: "WAKWA_COVERAGE", posts: "WAKWA_POSTS"
  };

  // Minimal schema contract: each remote collection must resolve to the same
  // shape as its local window.WAKWA_* counterpart (documented in content/*.js).
  var SANITY_QUERIES = {
    services: '*[_type=="service"]{slug,title,icon,short,body,included,ideal,fleet,faqs}',
    fleet: '*[_type=="vehicle"]{id,name,cap,axle,bed,use,avail,img}',
    materials: '*[_type=="material"]{name,unit,truckload,note}',
    testimonials: '*[_type=="testimonial"]{n,c,r,t,s}',
    faqs: '*[_type=="faq"]{c,q,a}',
    projects: '*[_type=="project"]{slug,title,client,tonnes,dist,days,img,quote,challenge,solution,result}',
    team: '*[_type=="member"]{n,r}',
    coverage: '*[_type=="coverage"][0]{hubs,corridors,cities}',
    posts: '*[_type=="post"]{slug,title,date,read,ex,body}',
    site: '*[_type=="siteSettings"][0]'
  };

  function fresh(key) {
    var cfg = window.WAKWA_CMS || {};
    var e = mem[key];
    return e && (Date.now() - e.at) < (cfg.ttlMs || 300000);
  }

  function localGet(collection) {
    var g = LOCAL_MAP[collection];
    var v = g ? window[g] : undefined;
    // deep-clone so callers can't mutate the global by accident
    return v === undefined ? null : JSON.parse(JSON.stringify(v));
  }

  function sanityGet(collection, s) {
    var q = SANITY_QUERIES[collection];
    if (!q) return Promise.resolve(localGet(collection));
    var url = "https://" + s.projectId + ".api.sanity.io/v" +
      (s.apiVersion || "2026-01-01") + "/data/query/" + (s.dataset || "production") +
      "?query=" + encodeURIComponent(q);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("sanity " + r.status);
      return r.json();
    }).then(function (j) { return j.result; });
  }

  function contentfulGet(collection, c) {
    // content_type names must match your Contentful model (lowercase singular ok)
    var type = { posts: "post", services: "service", projects: "project", faqs: "faq" }[collection] || collection;
    var url = "https://cdn.contentful.com/spaces/" + c.spaceId + "/environments/" +
      (c.environment || "master") + "/entries?content_type=" + encodeURIComponent(type) +
      "&access_token=" + encodeURIComponent(c.token) + "&limit=100";
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("contentful " + r.status);
      return r.json();
    }).then(function (j) {
      return (j.items || []).map(function (it) { return Object.assign({ _id: it.sys.id }, it.fields); });
    });
  }

  function remoteGet(collection) {
    var cfg = window.WAKWA_CMS || {};
    if (cfg.provider === "sanity" && cfg.sanity && cfg.sanity.projectId) return sanityGet(collection, cfg.sanity);
    if (cfg.provider === "contentful" && cfg.contentful && cfg.contentful.spaceId) return contentfulGet(collection, cfg.contentful);
    return Promise.resolve(null);
  }

  // Primary API: resolves remote-first, falls back to local on any failure.
  function get(collection) {
    if (fresh(collection)) return Promise.resolve(mem[collection].data);
    return remoteGet(collection).then(function (remote) {
      var data = remote == null ? localGet(collection) : remote;
      mem[collection] = { at: Date.now(), data: data };
      return data;
    }).catch(function () {
      var data = localGet(collection);
      mem[collection] = { at: Date.now(), data: data };
      return data;
    });
  }

  function getSync(collection) { return localGet(collection); } // for render-critical paths
  function refresh(collection) { delete mem[collection]; return get(collection); }

  return { get: get, getSync: getSync, refresh: refresh, LOCAL_MAP: LOCAL_MAP };
})();
