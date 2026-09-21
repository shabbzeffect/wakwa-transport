// API + mailer notes. On Vercel deploy as /api/quote.js (Node). Static fallback uses localStorage.
// lib/mailer.ts equivalent: swap Resend/Nodemailer keys via env. Template below.
async function sendQuoteEmail({ref,data,est}){
  const toOps = process.env.OPS_EMAIL || "[[EMAIL]]";
  const html = `<h2>New quote ${ref}</h2><p>${data.from} → ${data.to} · ${data.cargo} ${data.tonnes}T</p><p>Est: ${est.low}–${est.high}</p><p>${data.name} ${data.phone} ${data.email||""}</p><p>${data.notes||""}</p>`;
  // await resend.emails.send({from:"dispatch@wakwa.example.com",to:toOps,subject:`Quote ${ref}`,html});
  return {ok:true};
}
window.sendQuoteEmail = sendQuoteEmail;
