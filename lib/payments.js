/* WAKWA payments — M-Pesa (Daraja STK push) + Stripe Checkout behind one API.
 * Modes: 'stub' (default, fully offline demo) or 'live' (calls /api/* which hold
 * secrets server-side — NEVER put SECRET keys in this browser file).
 *
 *   window.WAKWA_PAYMENTS = { mode:'stub',
 *     mpesa:{ endpoint:'/api/mpesa/stk' }, stripe:{ endpoint:'/api/stripe/checkout' } };
 */
window.WAKWA_PAYMENTS = Object.assign(
  { mode: "stub", mpesa: { endpoint: "/api/mpesa/stk" }, stripe: { endpoint: "/api/stripe/checkout" } },
  window.WAKWA_PAYMENTS || {}
);

window.WakwaPay = (function () {
  function cfg() { return window.WAKWA_PAYMENTS || { mode: "stub" }; }

  function normaliseKE(phone) {
    var p = String(phone || "").replace(/[\s-]/g, "");
    if (/^0[17]\d{8}$/.test(p)) return "254" + p.slice(1);
    if (/^254[17]\d{8}$/.test(p)) return p;
    if (/^\+254[17]\d{8}$/.test(p)) return p.slice(1);
    return null;
  }

  // M-Pesa STK push. Resolves {ok, receipt} on success. Stub simulates the
  // phone prompt + 6s confirmation so the UX can be tested without Daraja creds.
  function mpesaStkPush(invoice, phone) {
    var msisdn = normaliseKE(phone);
    if (!msisdn) return Promise.reject(new Error("Enter a valid M-Pesa number (07… / 01…)."));
    if (cfg().mode !== "live") {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var receipt = "STUB-" + Math.random().toString(36).slice(2, 10).toUpperCase();
          resolve({ ok: true, stub: true, receipt: receipt, msisdn: msisdn });
        }, 6000);
      });
    }
    return fetch(cfg().mpesa.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoice.id, amount: invoice.total, phone: msisdn })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.ok !== true) throw new Error((j && j.error) || "STK push failed");
      return j;
    });
  }

  // Stripe Checkout. Live mode redirects to session url from /api/stripe/checkout.
  // Stub resolves a fake session so the flow is testable without keys.
  function stripeCheckout(invoice) {
    if (cfg().mode !== "live") {
      return Promise.resolve({ ok: true, stub: true,
        receipt: "STRIPE-STUB-" + Date.now().toString(36).toUpperCase(),
        note: "Stub — no charge made. Add STRIPE_SECRET_KEY to go live." });
    }
    return fetch(cfg().stripe.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoice.id, amount: invoice.total,
        currency: "kes", successUrl: location.origin + "/billing.html?paid=" + invoice.id,
        cancelUrl: location.origin + "/billing.html?cancel=" + invoice.id })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.url) { location.href = j.url; return j; }
      throw new Error((j && j.error) || "Checkout failed");
    });
  }

  function complete(invoiceId, method, receipt) {
    var inv = window.WakwaInvoices.markPaid(invoiceId, method, receipt);
    if (inv && window.WakwaAnalytics) {
      WakwaAnalytics.track("purchase", { transaction_id: inv.id, value: inv.total, currency: "KES", method: method });
    }
    return inv;
  }

  return { mpesaStkPush: mpesaStkPush, stripeCheckout: stripeCheckout,
           complete: complete, normaliseKE: normaliseKE };
})();
