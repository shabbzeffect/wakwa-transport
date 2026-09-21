// Vercel serverless: quote intake (the /api/quote endpoint quote.html already POSTs to).
// Static fallback (localStorage + thank-you page) keeps working without this.
// Env: OPS_EMAIL, RESEND_API_KEY (or SMTP_* for Nodemailer — see lib/mailer.js).
// Stores to console/log + optional Resend; production: append to DB/KV here.
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(JSON.stringify({ error: "POST only" })); }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || !body.ref) { res.statusCode = 400; return res.end(JSON.stringify({ error: "quote ref required" })); }
  console.log("[quote]", body.ref, body.from, "->", body.to, body.phone);
  // TODO: await sendQuoteEmail({ ref: body.ref, data: body, est: body.est });
  res.statusCode = 200;
  return res.end(JSON.stringify({ ok: true, ref: body.ref }));
};
