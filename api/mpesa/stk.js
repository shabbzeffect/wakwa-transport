// Vercel serverless: M-Pesa Daraja STK push (C2B).
// Env required for live: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET,
//   MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_ENV=sandbox|production
// Without env: returns {ok:false, stub:true} so billing.html stays in demo mode.
// Real flow: OAuth (consumer key/secret) -> STK push (shortcode+passkey+timestamp
// password) -> customer enters PIN -> callback URL records receipt. Set
// MPESA_CALLBACK_URL to a /api/mpesa/callback route in production.
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(JSON.stringify({ error: "POST only" })); }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const { invoiceId, amount, phone } = body || {};
  if (!invoiceId || !amount || !phone) { res.statusCode = 400; return res.end(JSON.stringify({ error: "invoiceId, amount, phone required" })); }
  const { MPESA_CONSUMER_KEY, MPESA_SHORTCODE } = process.env;
  if (!MPESA_CONSUMER_KEY || !MPESA_SHORTCODE) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: false, stub: true, error: "M-Pesa not configured (missing env). Billing page uses stub mode." }));
  }
  // TODO: implement OAuth + STK push here (daraja docs: developer.safaricom.co.ke).
  // const token = await oauth(...); await stkPush({shortcode, amount, phone, callback});
  res.statusCode = 501;
  return res.end(JSON.stringify({ ok: false, error: "Live STK not yet wired — add Daraja call where marked TODO." }));
};
