/* Shared shell: header/footer, theme, nav, animations, counters, search, toasts, consent */
(function(){
const S = window.WAKWA_SITE;
const $ = (s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
function toast(msg){ const w=$('#toasts')||(()=>{const d=document.createElement('div');d.id='toasts';d.className='toast-wrap';document.body.appendChild(d);return d})(); const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;w.appendChild(t);setTimeout(()=>t.remove(),4200); }
window.wakwaToast=toast;
function logoSVG(variant){ const w = variant==='mono'?'#fff':'#0B0F14'; const a='#F5A524';
 return `<span style="display:inline-flex;align-items:center;gap:10px"><svg width="40" height="40" viewBox="0 0 48 48" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="10" fill="${variant==='light'?'#0B0F14':'#0B0F14'}"/><path d="M8 12 L16 36 L24 18 L32 36 L40 12" fill="none" stroke="${a}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 38 H38" stroke="${variant==='mono'?'#fff':a}" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round"/></svg><span style="font-family:var(--font-head);font-weight:900;font-size:24px;letter-spacing:.04em">WAKWA</span></span>`; }
function headerHTML(page){ return `
<div class="topbar"><div class="container" style="display:flex;gap:16px;align-items:center;justify-content:space-between;padding-top:7px;padding-bottom:7px;flex-wrap:wrap">
<div>📞 <a href="${S.phoneHref}">${S.phone}</a> &nbsp; ✉️ <a href="mailto:${S.email}">${S.email}</a> &nbsp; <span>🕒 ${S.hours}</span></div>
<div style="display:flex;gap:12px;align-items:center"><span class="badge" style="background:var(--wakwa-amber);color:#141414;border-color:var(--wakwa-amber)">24/7 DISPATCH</span>
<button id="themeBtn" class="btn btn-outline btn-sm" aria-label="Toggle dark mode" aria-pressed="false">🌙/☀️</button>
<select id="langSel" aria-label="Language" style="background:#111;color:#fff;border:1px solid #333;border-radius:8px;padding:8px;min-height:44px"><option value="en">EN</option><option value="sw">SW</option></select></div>
</div></div>
<header class="site-header solid" id="siteHeader"><div class="container" style="display:flex;align-items:center;gap:18px;padding-top:12px;padding-bottom:12px">
<a href="index.html" aria-label="WAKWA home" style="color:inherit;text-decoration:none">${logoSVG()}</a>
<nav aria-label="Main" style="display:flex;gap:18px;align-items:center;margin-left:auto" class="desk-nav">
<span class="has-mega" style="position:relative"><a class="nav-link" href="services.html">Services ▾</a>
<span class="mega card" id="megaMenu" role="menu"></span></span>
<a class="nav-link" href="fleet.html">Fleet</a><a class="nav-link" href="supply.html">Supply</a><a class="nav-link" href="coverage.html">Coverage</a>
<span class="has-mega" style="position:relative"><a class="nav-link" href="about.html">Company ▾</a>
<span class="mega card" style="width:280px"><span style="display:grid;gap:8px;padding:4px">
<a class="nav-link" href="about.html">About Us</a><a class="nav-link" href="projects.html">Projects</a><a class="nav-link" href="blog.html">Blog</a><a class="nav-link" href="careers.html">Careers</a><a class="nav-link" href="partners.html">Partners</a><a class="nav-link" href="portal.html">Client Portal</a></span></span></span>
<a class="nav-link" href="contact.html">Contact</a>
</nav>
<div style="display:flex;gap:10px;align-items:center;margin-left:12px">
<a class="btn btn-amber" href="quote.html" data-i18n="quote">Get a Quote</a>
<button id="navToggle" class="btn btn-outline btn-sm" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav" style="display:none">☰</button>
</div></div>
<div id="mobileNav" hidden style="border-top:1px solid var(--line);background:var(--bg)"><div class="container" style="padding:14px 20px 20px;display:grid;gap:10px" id="mobileLinks"></div></div>
</header>`; }
function footerHTML(){ const svc=(window.WAKWA_SERVICES||[]).slice(0,6).map(s=>`<li><a href="service-detail.html?slug=${s.slug}">${s.title}</a></li>`).join('');
 return `<div class="hazard-thin"></div><footer class="site-footer" style="background:var(--wakwa-black);color:#cfd6df"><div class="container" style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1.2fr;gap:28px;padding:56px 20px 28px" class="foot-grid" id="footGrid">
<div><div style="color:#fff">${logoSVG('mono')}</div><p style="max-width:34ch">We move what builds nations. Construction materials, bulk cargo and heavy equipment — supplied, loaded and delivered anywhere, on time.</p><p>📞 ${S.phone}<br>✉️ ${S.email}<br>📍 ${S.address}, ${S.city}, ${S.country}<br>Reg: ${S.regNo}</p></div>
<div><h3 style="color:#fff">Services</h3><ul style="list-style:none;padding:0;display:grid;gap:8px">${svc}</ul></div>
<div><h3 style="color:#fff">Company</h3><ul style="list-style:none;padding:0;display:grid;gap:8px"><li><a href="about.html">About</a></li><li><a href="fleet.html">Fleet</a></li><li><a href="supply.html">Supply</a></li><li><a href="coverage.html">Coverage</a></li><li><a href="faq.html">FAQ</a></li><li><a href="blog.html">Blog</a></li><li><a href="careers.html">Careers</a></li><li><a href="portal.html">Client Portal</a></li><li><a href="billing.html">Billing & Payments</a></li><li><a href="driver.html">Driver App</a></li><li><a href="track.html">Track Shipment</a></li></ul></div>
<div><h3 style="color:#fff">Get site rates</h3><p>One email a month. Prices, capacity, no spam.</p><form id="newsForm" style="display:flex;gap:8px"><input class="field" required type="email" placeholder="you@company.com" aria-label="Email address" style="background:#111;color:#fff;border-color:#333"><button class="btn btn-amber">Join</button></form><p style="font-size:12px">Pay via M-Pesa · card · bank · cheque. <a href="billing.html">Billing</a> · <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="cookies.html">Cookies</a></p></div>
</div><div style="border-top:1px solid #26303d"><div class="container" style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 20px;font-size:13px"><span>© 2026 ${S.name}. All rights reserved.</span><span>Website by ${S.developer}</span><button id="topBtn" class="btn btn-outline btn-sm" style="color:#fff">↑ Top</button></div></div></footer>
<a class="fab-wa" id="waFab" href="${S.whatsappLink}?text=${encodeURIComponent('Hi WAKWA, I need a truck/quote.')}" aria-label="Chat with dispatch on WhatsApp" target="_blank" rel="noopener">💬</a>
<nav class="mobile-bar no-print" aria-label="Quick actions"><a href="${S.phoneHref}">📞 Call</a><a href="${S.whatsappLink}">💬 WhatsApp</a><a href="quote.html" style="background:var(--wakwa-amber);color:#141414">Get Quote</a></nav>
<div id="consent" hidden class="card no-print consent-card" role="dialog" aria-label="Cookie consent" aria-live="polite"><b>We use cookies.</b><p style="margin:6px 0;font-size:14px">Analytics only loads after you accept. See <a href="cookies.html">Cookies</a>.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-amber btn-sm" id="consentYes">Accept</button><button class="btn btn-outline btn-sm" id="consentNo">Decline</button></div></div>
<div id="emg" hidden style="background:var(--danger);color:#fff;text-align:center;padding:10px;font-weight:800"></div>`; }
function mount(page){
 document.documentElement.classList.add('js'); // gates .reveal hidden-state: no-JS still shows content
 document.body.insertAdjacentHTML('afterbegin', headerHTML(page));
 document.body.insertAdjacentHTML('beforeend', footerHTML());
 // theme — stored choice wins, else OS preference
 const stored=localStorage.getItem('wakwa-theme');
 const th=stored||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
 document.documentElement.dataset.theme=th;
 const themeBtn=$('#themeBtn');
 const syncTheme=()=>themeBtn.setAttribute('aria-pressed',document.documentElement.dataset.theme==='dark'?'true':'false');
 syncTheme();
 themeBtn.onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('wakwa-theme',n);syncTheme();};
 // active nav — visual + screen-reader current
 $$('.desk-nav .nav-link').forEach(a=>{ if(a.getAttribute('href')===page){a.classList.add('active');a.setAttribute('aria-current','page');} });
 // mega
 const mega=$('#megaMenu'); if(mega){ mega.innerHTML=`<span style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${(window.WAKWA_SERVICES||[]).map(s=>`<a class="nav-link" href="service-detail.html?slug=${s.slug}">${s.icon} ${s.title}</a>`).join('')}</span>`; }
 // mobile nav — toggle, close on navigate, Escape to dismiss
 const t=$('#navToggle'), m=$('#mobileNav'); const mq=()=>{ t.style.display = window.innerWidth<1000?'block':'none'; $('.desk-nav').style.display=window.innerWidth<1000?'none':'flex'; }; mq(); addEventListener('resize',mq);
 $('#mobileLinks').innerHTML=['Services: services.html','Fleet: fleet.html','Supply: supply.html','Coverage: coverage.html','Quote: quote.html','Track: track.html','Billing: billing.html','About: about.html','Contact: contact.html','FAQ: faq.html'].map(x=>{const[t,h]=x.split(': ');return `<a class="btn btn-outline" href="${h}">${t}</a>`}).join('');
 const setNav=open=>{ m.hidden=!open; t.setAttribute('aria-expanded',open?'true':'false'); t.setAttribute('aria-label',open?'Close menu':'Open menu'); };
 t.onclick=()=>setNav(m.hidden);
 m.addEventListener('click',e=>{ if(e.target.closest('a')) setNav(false); });
 document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!m.hidden) setNav(false); });
 initLang();
 $('#topBtn').onclick=()=>scrollTo({top:0,behavior:'smooth'});
 const nf=$('#newsForm'); if(nf) nf.onsubmit=e=>{e.preventDefault();toast('Subscribed! Confirm via email (double-opt-in stub).');nf.reset();};
  if(!localStorage.getItem('wakwa-consent')){ $('#consent').hidden=false; $('#consentYes').focus({preventScroll:true}); }
  $('#consentYes').onclick=()=>{localStorage.setItem('wakwa-consent','yes');$('#consent').hidden=true;initVendorStacks();};
  $('#consentNo').onclick=()=>{localStorage.setItem('wakwa-consent','no');$('#consent').hidden=true;};
  if(localStorage.getItem('wakwa-consent')==='yes') initVendorStacks();
 // reveal + counters — skip animation entirely under reduced motion / no IO
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!('IntersectionObserver' in window)||reduceMotion){
   $$('.reveal').forEach(el=>el.classList.add('in'));
   $$('[data-count]').forEach(el=>{ el.textContent=Number(el.dataset.count).toLocaleString()+(el.dataset.suffix||''); });
 }else{
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
 $$('.reveal').forEach(el=>io.observe(el));
 $$('[data-count]').forEach(el=>{ const end=parseFloat(el.dataset.count); const suf=el.dataset.suffix||''; const cio=new IntersectionObserver(es=>{if(es[0].isIntersecting){cio.disconnect();const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(end*(1-Math.pow(1-p,3))).toLocaleString()+suf;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step);}});cio.observe(el); });
  } // end motion-safe branch
 // emergency banner slot: set window.WAKWA_EMERGENCY="..." to enable
 if(window.WAKWA_EMERGENCY){ const e=$('#emg'); e.textContent='⚠️ '+window.WAKWA_EMERGENCY; e.hidden=false; document.body.prepend(e); }
 // foot responsive
 const fg=$('#footGrid'); const fit=()=>{ if(fg) fg.style.gridTemplateColumns = window.innerWidth<900?'1fr 1fr':'1.2fr 1fr 1fr 1.2fr'; if(window.innerWidth<560&&fg) fg.style.gridTemplateColumns='1fr'; }; fit(); addEventListener('resize',fit);
}
function initLang(){
 // Lightweight i18n: persists choice, swaps [data-i18n] strings from locales/<lang>.json.
 // locales/en.json is the fallback; missing keys keep their English markup.
 const sel=$('#langSel'); if(!sel) return;
 const saved=localStorage.getItem('wakwa-lang')||'en'; sel.value=saved;
 const base=(function(){ try{
   const el=document.querySelector('script[src*="site.js"]');
   const src=el?el.getAttribute('src'):'assets/js/site.js';
   return src.replace(/assets\/js\/site\.js$/,'');
 }catch(e){ return ''; } })();
 function apply(lang){
   if(lang==='en'){ $$('[data-i18n]').forEach(el=>{ if(el.dataset.en) el.textContent=el.dataset.en; }); return; }
   const urls=[base+'locales/'+lang+'.json','locales/'+lang+'.json','../locales/'+lang+'.json'];
   (function next(i){
     if(i>=urls.length) return;
     fetch(urls[i]).then(r=>{ if(!r.ok) throw 0; return r.json(); }).then(dict=>{
       $$('[data-i18n]').forEach(el=>{
         if(!el.dataset.en) el.dataset.en=el.textContent; // stash English once
         const k=el.dataset.i18n;
         if(dict[k]) el.textContent=dict[k];
       });
     }).catch(()=>next(i+1));
   })(0);
 }
 sel.onchange=()=>{ localStorage.setItem('wakwa-lang',sel.value); apply(sel.value);
   toast(sel.value==='sw'?'Kiswahili kimechaguliwa (demo — nav na CTA zimetafsiriwa).':'English restored.'); };
 if(saved!=='en') apply(saved);
}
function ensureVendorScripts(){
  if(window.__wakwaVendorLoaded) return window.__wakwaVendorLoaded;
  function one(src){ return new Promise(function(res){
    var s=document.createElement('script'); s.src=src; s.defer=true;
    s.onload=res; s.onerror=res; document.head.appendChild(s);
  });}
  var base = (function(){ try{
    var el=document.querySelector('script[src*="site.js"]');
    var src=el ? el.getAttribute('src') : 'assets/js/site.js';
    return src.replace(/site\.js$/, '');
  }catch(e){ return 'assets/js/'; } })();
  window.__wakwaVendorLoaded = Promise.all([
    window.WakwaAnalytics ? Promise.resolve() : one(base + 'analytics.js'),
    window.WakwaChat ? Promise.resolve() : one(base + 'chat.js')
  ]);
  // fix relative path when called from tools/ subdirectory pages
  return window.__wakwaVendorLoaded;
}
function initVendorStacks(){
  ensureVendorScripts().then(function(){
    try{ if(window.WakwaAnalytics) window.WakwaAnalytics.init(); }catch(e){}
    try{ if(window.WakwaChat) window.WakwaChat.load(); }catch(e){}
  });
}
function loadAnalytics(){ initVendorStacks(); } // backward-compat alias
window.WAKWA_MOUNT=mount;
})();
