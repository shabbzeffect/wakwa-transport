// Transparent indicative pricing model. All rates editable by owner.
// Formula: (basePerKm * km + tonnageRate * tonnes) * truckMult * urgencyMult + loadFees + fuel% + border + waiting
window.WAKWA_PRICING = {
  currency: "KES",
  basePerKm: 180,          // per km
  tonnageRate: 900,        // per tonne
  m3Rate: 1200,            // per m3 (when volume billing)
  truckMult: { pickup:1.0, tipper7:1.0, tipper10:1.25, tipper20:1.8, tipper30:2.4, flatbed:1.9, lowbed:2.8, tanker:2.0, box:1.4, reefer:2.2, van:0.7, skip:1.2, hooklift:1.6 },
  urgencyMult: { standard:1.0, express:1.35, emergency:1.7 },
  loadingFee: 2500, offloadingFee: 2500,
  fuelSurchargePct: 0.08,
  crossBorderFee: 25000,
  waitingPerHour: 1500,
  minCharge: 6000
};
function wakwaEstimate(o){
  const P = window.WAKWA_PRICING;
  const km = Math.max(0, Number(o.km||0)), t = Math.max(0, Number(o.tonnes||0));
  const tm = P.truckMult[o.truck||'tipper10'] ?? 1.25;
  const um = P.urgencyMult[o.urgency||'standard'] ?? 1;
  let line = (P.basePerKm*km + P.tonnageRate*t) * tm * um;
  if(o.loading) line += P.loadingFee;
  if(o.offloading) line += P.offloadingFee;
  line += line * P.fuelSurchargePct;
  if(o.crossBorder) line += P.crossBorderFee;
  line += (Number(o.waitHours||0)) * P.waitingPerHour;
  line = Math.max(line, P.minCharge);
  const lo = Math.round(line*0.92/500)*500, hi = Math.round(line*1.12/500)*500;
  return { low: lo, high: hi, mid: Math.round(line/500)*500 };
}
function wakwaRef(){ const d=new Date(), p=n=>String(n).padStart(2,'0'); return `WKW-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${Math.floor(1000+Math.random()*9000)}`; }
