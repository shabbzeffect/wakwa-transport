/* WAKWA portal auth — demo email+PIN sessions.
 * Demo accounts (PIN is the password): client@demo/1234 (client),
 * driver@demo/2468 (driver), admin@demo/7890 (admin).
 * Session lives in sessionStorage (cleared when the tab closes). This is a
 * functional stub for quotes/invoices/POD demos — NOT real security.
 * Production swap: Supabase Auth / Auth.js / Firebase (email magic-link + OTP),
 * keep this file's API (login/logout/session/requireRole) so portal.html is untouched.
 */
window.WakwaAuth = (function () {
  var KEY = "wakwa-session";
  var USERS = [
    { email: "client@demo", pin: "1234", role: "client", name: "Demo Client" },
    { email: "driver@demo", pin: "2468", role: "driver", name: "Demo Driver" },
    { email: "admin@demo", pin: "7890", role: "admin", name: "Dispatch Admin" }
  ];

  function session() { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function login(email, pin) {
    var u = USERS.find(function (x) {
      return x.email === String(email || "").trim().toLowerCase() && x.pin === String(pin || "").trim();
    });
    if (!u) return { ok: false, error: "Unknown email/PIN (try client@demo / 1234)." };
    var s = { email: u.email, role: u.role, name: u.name, at: new Date().toISOString() };
    sessionStorage.setItem(KEY, JSON.stringify(s));
    return { ok: true, session: s };
  }
  function logout() { sessionStorage.removeItem(KEY); }
  function requireRole(roles) {
    var s = session();
    if (!s) return false;
    return roles.indexOf(s.role) !== -1;
  }
  return { login: login, logout: logout, session: session, requireRole: requireRole };
})();
