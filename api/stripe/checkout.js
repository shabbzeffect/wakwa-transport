// Vercel serverless: Stripe Checkout session for an invoice.
// Env required for live: STRIPE_SECRET_KEY (server only — never expose in browser).
// Without env: returns {ok:false, stub:true} so billing.html stays in demo mode.
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(JSON.stringify({ error: "POST only" })); }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const { invoiceId, amount, currency, successUrl, cancelUrl } = body || {};
  if (!invoiceId || !amount) { res.statusCode = 400; return res.end(JSON.stringify({ error: "invoiceId, amount required" })); }
  if (!process.env.STRIPE_SECRET_KEY) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: false, stub: true, error: "Stripe not configured (missing STRIPE_SECRET_KEY)." }));
  }
  // TODO: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const s = await stripe.checkout.sessions.create({ mode:'payment',
  //   line_items:[{price_data:{currency:currency||'kes',product_data:{name:'WAKWA '+invoiceId},unit_amount:Math.round(amount*100)},quantity:1}],
  //   success_url:successUrl, cancel_url:cancelUrl });
  // return res.end(JSON.stringify({ ok:true, url:s.url }));
  res.statusCode = 501;
  return res.end(JSON.stringify({ ok: false, error: "Live Stripe not yet wired — add SDK call where marked TODO." }));
};
