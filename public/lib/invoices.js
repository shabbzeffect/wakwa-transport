/* WAKWA invoices — quote → invoice, VAT totals, print-friendly render.
 * Storage: localStorage `wakwa-invoices` (demo). Production: persist via /api
 * (same shape) or your accounting tool; this module's object shape is the contract.
 */
window.WAKWA_BILLING = Object.assign(
  { vatPct: 16, pin: "[[KRA_PIN]]", payTerms: "70% on dispatch, balance on POD" },
  window.WAKWA_BILLING || {}
);

window.WakwaInvoices = (function () {
  var KEY = "wakwa-invoices";

  function all() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function num() {
    var d = new Date();
    return "INV-" + d.getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function totals(amount) {
    var cfg = window.WAKWA_BILLING || { vatPct: 16 };
    var sub = Math.round(Number(amount) || 0);
    var vat = Math.round(sub * (cfg.vatPct || 0) / 100);
    return { sub: sub, vat: vat, total: sub + vat, vatPct: cfg.vatPct || 0 };
  }

  // Build an invoice from a submitted quote object {ref,from,to,cargo,tonnes,est,...}
  function fromQuote(q) {
    var amount = (q && q.est && q.est.mid) || (q && q.est && q.est.high) || 0;
    var t = totals(amount);
    var inv = {
      id: num(), ref: (q && q.ref) || "", client: (q && (q.co || q.name)) || "Walk-in client",
      route: ((q && q.from) || "?") + " → " + ((q && q.to) || "?"),
      desc: ((q && q.cargo) || "Transport") + " · " + ((q && q.tonnes) || "") + "T",
      sub: t.sub, vat: t.vat, total: t.total, vatPct: t.vatPct,
      status: "unpaid", method: "", receipt: "",
      at: new Date().toISOString()
    };
    var list = all(); list.unshift(inv); save(list);
    return inv;
  }

  function seedDemo() {
    if (all().length) return all();
    var demo = [{ id: "INV-2026-1001", ref: "WKW-DEMO", client: "Demo Client",
      route: "Athi River → Kitengela", desc: "Ballast · 10T", sub: 48500,
      vat: 7760, total: 56260, vatPct: 16, status: "unpaid",
      method: "", receipt: "", at: new Date().toISOString() }];
    save(demo); return demo;
  }

  function get(id) { return all().find(function (i) { return i.id === id; }); }
  function markPaid(id, method, receipt) {
    var list = all();
    var inv = list.find(function (i) { return i.id === id; });
    if (!inv) return null;
    inv.status = "paid"; inv.method = method; inv.receipt = receipt || "";
    inv.paidAt = new Date().toISOString(); save(list); return inv;
  }

  function money(n) { return "KES " + Number(n || 0).toLocaleString(); }

  function render(inv) {
    var S = window.WAKWA_SITE || {};
    return '<div class="card" style="padding:24px" id="invDoc">' +
      '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
      '<div><h2 style="margin:0">' + (S.name || "WAKWA") + '</h2><small>' + (S.address || "") + ', ' + (S.city || "") +
      ' · KRA PIN: ' + ((window.WAKWA_BILLING || {}).pin || "") + '</small></div>' +
      '<div style="text-align:right"><b class="tabular">' + inv.id + '</b><br><small>' + new Date(inv.at).toLocaleString() + '</small><br>' +
      '<span class="badge ' + (inv.status === "paid" ? "badge-ok" : "badge-warn") + '">' + inv.status.toUpperCase() + '</span></div></div>' +
      '<div class="table-scroll" style="margin-top:12px"><table class="spec"><tr><th>Bill to</th><td>' + inv.client + '</td></tr>' +
      '<tr><th>Route / ref</th><td>' + inv.route + ' · ' + inv.ref + '</td></tr>' +
      '<tr><th>Description</th><td>' + inv.desc + '</td></tr>' +
      '<tr><th>Subtotal</th><td class="tabular">' + money(inv.sub) + '</td></tr>' +
      '<tr><th>VAT (' + inv.vatPct + '%)</th><td class="tabular">' + money(inv.vat) + '</td></tr>' +
      '<tr><th>Total</th><td class="tabular"><b>' + money(inv.total) + '</b></td></tr>' +
      (inv.receipt ? '<tr><th>Receipt</th><td class="tabular">' + inv.receipt + ' via ' + inv.method + '</td></tr>' : '') + '</table></div>' +
      '<p style="font-size:12px;color:var(--muted)">Terms: ' + ((window.WAKWA_BILLING || {}).payTerms || "") + '</p></div>';
  }

  return { all: all, save: save, totals: totals, fromQuote: fromQuote,
           seedDemo: seedDemo, get: get, markPaid: markPaid, money: money, render: render };
})();
