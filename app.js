const LINKS={deriv:'https://t.deriv.link?t=N4YTBACHU9HN',hfm:'https://www.hfm.com/sv/en/?refid=30477807'};
const qs=new URLSearchParams(location.search);const vid=localStorage.rae_vid||(localStorage.rae_vid=crypto.randomUUID());
const utm={source:qs.get('utm_source')||'direct',medium:qs.get('utm_medium')||'none',campaign:qs.get('utm_campaign')||'none',content:qs.get('utm_content')||'none'};
async function track(event,props={}){try{await fetch('/api/events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({event,visitorId:vid,utm,props})})}catch{}}
track('landing_view');
const eligibilityMsg=document.querySelector('#eligibilityMsg'),qualification=document.querySelector('#qualification'),result=document.querySelector('#result'),routes=document.querySelector('#routes');
document.querySelectorAll('.eligibility-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.eligible==='yes';track('eligibility_complete',{eligible:ok?'yes':'no'});if(ok){qualification.hidden=false;eligibilityMsg.hidden=true;qualification.scrollIntoView({behavior:'smooth'});}else{qualification.hidden=true;result.hidden=true;eligibilityMsg.hidden=false;document.querySelector('.dark').scrollIntoView({behavior:'smooth'});}});
document.querySelectorAll('#qualification .choice').forEach(b=>b.onclick=()=>{const m=b.dataset.market;track('qualification_complete',{market:m});result.hidden=false;routes.innerHTML='';const add=(broker,label,desc)=>{const a=document.createElement('a');a.className='broker';a.href=LINKS[broker];a.target='_blank';a.rel='noopener noreferrer sponsored';a.innerHTML=`<div>${label}<small>${desc}</small></div><span class="arrow">→</span>`;a.onclick=()=>track('affiliate_click',{broker,market:m});routes.appendChild(a)};if(m==='synthetic')add('deriv','Découvrir Deriv','Indices synthétiques — vérifiez disponibilité et conditions.');if(m==='forex_gold')add('hfm','Découvrir HFM','Forex & Or — vérifiez disponibilité et conditions.');if(m==='undecided'){add('deriv','Comparer Deriv','Option indices synthétiques.');add('hfm','Comparer HFM','Option Forex & Or.')}track('broker_route',{market:m});result.scrollIntoView({behavior:'smooth'});});
document.querySelector('#telegram').onclick=()=>track('telegram_join_click');document.querySelector('#whatsapp').onclick=()=>track('whatsapp_join_click');
if(location.hash==='#admin')document.querySelector('#admin').hidden=false;
window.raeAdmin=async()=>{const t=document.querySelector('#token').value;sessionStorage.rae_token=t;const r=await fetch('/api/summary',{headers:{authorization:`Bearer ${t}`}});if(!r.ok){document.querySelector('#adminmsg').textContent='Accès refusé.';return}const d=await r.json();document.querySelector('#dashboard').hidden=false;document.querySelector('#kpiVisitors').textContent=d.visitors;document.querySelector('#kpiQualified').textContent=d.qualified;document.querySelector('#kpiClicks').textContent=d.affiliateClicks;document.querySelector('#kpiCommission').textContent='$'+d.commission.toFixed(2);document.querySelector('#rate1').textContent=d.visitors?Math.round(d.qualified/d.visitors*100)+'%':'—';document.querySelector('#rate2').textContent=d.qualified?Math.round(d.affiliateClicks/d.qualified*100)+'%':'—';document.querySelector('#kpiTelegram').textContent=d.telegramClicks||0;document.querySelector('#kpiWhatsapp').textContent=d.whatsappClicks||0;document.querySelector('#kpiDeriv').textContent=d.brokerClicks?.deriv||0;document.querySelector('#kpiHfm').textContent=d.brokerClicks?.hfm||0;const cs=document.querySelector('#campaignStats');const rows=Object.entries(d.campaigns||{});cs.textContent=rows.length?rows.map(([n,x])=>n+' — '+x.visitors+' visiteurs · '+x.qualified+' qualifiés · '+x.clicks+' clics').join('\n'):'Aucune campagne mesurée pour le moment.';cs.style.whiteSpace='pre-line';const ac=document.querySelector('#acquisitionStats');const ar=d.acquisition||[];ac.textContent=ar.length?ar.map(x=>x.source+' / '+x.content+' — '+x.visitors+' visiteurs · '+x.qualified+' qualifiés ('+x.qualificationRate+'%) · '+x.clicks+' clics ('+x.clickRate+'%) · '+x.communityClicks+' communauté').join('\n'):'Aucune donnée canal × angle pour le moment.';ac.style.whiteSpace='pre-line';const fs=document.querySelector('#funnelStats');const fn=d.funnel||{},dr=d.dropoffs||{};fs.textContent=(fn.landingViews||0)+' vues landing → '+(fn.eligibilityCompleted||0)+' éligibilité → '+(fn.qualified||0)+' qualifiés → '+(fn.affiliateClicks||0)+' clics partenaires → '+(fn.communityClicks||0)+' clics communauté\nAbandons : landing→éligibilité '+(dr.landingToEligibility||0)+'% · éligibilité→qualification '+(dr.eligibilityToQualification||0)+'% · qualification→clic '+(dr.qualificationToClick||0)+'%';fs.style.whiteSpace='pre-line';const rec=document.querySelector('#recommendations');const rr=d.recommendations||[];rec.textContent=rr.length?rr.map(x=>x.status+' — '+x.source+' / '+x.content+' — '+x.reason+' ('+x.visitors+' visiteurs)').join('\n'):'Aucune décision : données insuffisantes.';rec.style.whiteSpace='pre-line';const vs=document.querySelector('#verifiedStats');const vt=d.verifiedTotals||{};const vb=d.businessByBroker||{};vs.textContent='TOTAL — '+(vt.broker_signup||0)+' inscriptions · '+(vt.first_deposit||0)+' premiers dépôts · '+(vt.first_trade||0)+' premiers trades · '+(vt.active_trader||0)+' actifs · .textContent=JSON.stringify(d,null,2)};
window.raeBusiness=async()=>{const t=sessionStorage.rae_token||document.querySelector('#token').value;const event=document.querySelector('#bevent').value,broker=document.querySelector('#bbroker').value,amount=Number(document.querySelector('#bamount').value||0),note=document.querySelector('#bnote').value;const r=await fetch('/api/business-events',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${t}`},body:JSON.stringify({event,broker,amount,note})});document.querySelector('#adminmsg').textContent=r.ok?'Enregistré.':'Erreur / accès refusé.';if(r.ok)raeAdmin()};

// RAE campaign links — one measurable URL per acquisition channel.
const campaignBase=location.origin+'/';
const CAMPAIGNS=[
  ['Telegram','telegram','community','sprint10','checklist'],
  ['WhatsApp','whatsapp','community','sprint10','checklist'],
  ['TikTok','tiktok','organic_social','sprint10','synthetic_vs_forex'],
  ['Facebook','facebook','organic_social','sprint10','checklist'],
  ['Instagram','instagram','organic_social','sprint10','synthetic_vs_forex'],
  ['Pinterest','pinterest','organic_social','sprint10','checklist']
];
function campaignUrl(source,medium,campaign,content){
  const u=new URL(campaignBase);u.searchParams.set('utm_source',source);u.searchParams.set('utm_medium',medium);u.searchParams.set('utm_campaign',campaign);u.searchParams.set('utm_content',content);return u.href;
}
window.renderCampaignLinks=()=>{const box=document.querySelector('#campaignLinks');if(!box)return;box.innerHTML=CAMPAIGNS.map(([name,s,m,c,k])=>`<div class="campaignrow"><div><b>${name}</b><small>${campaignUrl(s,m,c,k)}</small></div><button type="button" data-copy="${campaignUrl(s,m,c,k)}">Copier</button></div>`).join('');box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copié ✓';setTimeout(()=>b.textContent='Copier',1200)})};
+Number(vt.commission||0).toFixed(2)+' commissions\nDERIV — '+(vb.deriv?.broker_signup||0)+' inscriptions · '+(vb.deriv?.first_deposit||0)+' dépôts · '+(vb.deriv?.active_trader||0)+' actifs · .textContent=JSON.stringify(d,null,2)};
window.raeBusiness=async()=>{const t=sessionStorage.rae_token||document.querySelector('#token').value;const event=document.querySelector('#bevent').value,broker=document.querySelector('#bbroker').value,amount=Number(document.querySelector('#bamount').value||0),note=document.querySelector('#bnote').value;const r=await fetch('/api/business-events',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${t}`},body:JSON.stringify({event,broker,amount,note})});document.querySelector('#adminmsg').textContent=r.ok?'Enregistré.':'Erreur / accès refusé.';if(r.ok)raeAdmin()};

// RAE campaign links — one measurable URL per acquisition channel.
const campaignBase=location.origin+'/';
const CAMPAIGNS=[
  ['Telegram','telegram','community','sprint10','checklist'],
  ['WhatsApp','whatsapp','community','sprint10','checklist'],
  ['TikTok','tiktok','organic_social','sprint10','synthetic_vs_forex'],
  ['Facebook','facebook','organic_social','sprint10','checklist'],
  ['Instagram','instagram','organic_social','sprint10','synthetic_vs_forex'],
  ['Pinterest','pinterest','organic_social','sprint10','checklist']
];
function campaignUrl(source,medium,campaign,content){
  const u=new URL(campaignBase);u.searchParams.set('utm_source',source);u.searchParams.set('utm_medium',medium);u.searchParams.set('utm_campaign',campaign);u.searchParams.set('utm_content',content);return u.href;
}
window.renderCampaignLinks=()=>{const box=document.querySelector('#campaignLinks');if(!box)return;box.innerHTML=CAMPAIGNS.map(([name,s,m,c,k])=>`<div class="campaignrow"><div><b>${name}</b><small>${campaignUrl(s,m,c,k)}</small></div><button type="button" data-copy="${campaignUrl(s,m,c,k)}">Copier</button></div>`).join('');box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copié ✓';setTimeout(()=>b.textContent='Copier',1200)})};
+Number(vb.deriv?.commission||0).toFixed(2)+'\nHFM — '+(vb.hfm?.broker_signup||0)+' inscriptions · '+(vb.hfm?.first_deposit||0)+' dépôts · '+(vb.hfm?.active_trader||0)+' actifs · .textContent=JSON.stringify(d,null,2)};
window.raeBusiness=async()=>{const t=sessionStorage.rae_token||document.querySelector('#token').value;const event=document.querySelector('#bevent').value,broker=document.querySelector('#bbroker').value,amount=Number(document.querySelector('#bamount').value||0),note=document.querySelector('#bnote').value;const r=await fetch('/api/business-events',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${t}`},body:JSON.stringify({event,broker,amount,note})});document.querySelector('#adminmsg').textContent=r.ok?'Enregistré.':'Erreur / accès refusé.';if(r.ok)raeAdmin()};

// RAE campaign links — one measurable URL per acquisition channel.
const campaignBase=location.origin+'/';
const CAMPAIGNS=[
  ['Telegram','telegram','community','sprint10','checklist'],
  ['WhatsApp','whatsapp','community','sprint10','checklist'],
  ['TikTok','tiktok','organic_social','sprint10','synthetic_vs_forex'],
  ['Facebook','facebook','organic_social','sprint10','checklist'],
  ['Instagram','instagram','organic_social','sprint10','synthetic_vs_forex'],
  ['Pinterest','pinterest','organic_social','sprint10','checklist']
];
function campaignUrl(source,medium,campaign,content){
  const u=new URL(campaignBase);u.searchParams.set('utm_source',source);u.searchParams.set('utm_medium',medium);u.searchParams.set('utm_campaign',campaign);u.searchParams.set('utm_content',content);return u.href;
}
window.renderCampaignLinks=()=>{const box=document.querySelector('#campaignLinks');if(!box)return;box.innerHTML=CAMPAIGNS.map(([name,s,m,c,k])=>`<div class="campaignrow"><div><b>${name}</b><small>${campaignUrl(s,m,c,k)}</small></div><button type="button" data-copy="${campaignUrl(s,m,c,k)}">Copier</button></div>`).join('');box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copié ✓';setTimeout(()=>b.textContent='Copier',1200)})};
+Number(vb.hfm?.commission||0).toFixed(2);vs.style.whiteSpace='pre-line';document.querySelector('#raw').textContent=JSON.stringify(d,null,2)};
window.raeBusiness=async()=>{const t=sessionStorage.rae_token||document.querySelector('#token').value;const event=document.querySelector('#bevent').value,broker=document.querySelector('#bbroker').value,amount=Number(document.querySelector('#bamount').value||0),note=document.querySelector('#bnote').value;const r=await fetch('/api/business-events',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${t}`},body:JSON.stringify({event,broker,amount,note})});document.querySelector('#adminmsg').textContent=r.ok?'Enregistré.':'Erreur / accès refusé.';if(r.ok)raeAdmin()};

// RAE campaign links — one measurable URL per acquisition channel.
const campaignBase=location.origin+'/';
const CAMPAIGNS=[
  ['Telegram','telegram','community','sprint10','checklist'],
  ['WhatsApp','whatsapp','community','sprint10','checklist'],
  ['TikTok','tiktok','organic_social','sprint10','synthetic_vs_forex'],
  ['Facebook','facebook','organic_social','sprint10','checklist'],
  ['Instagram','instagram','organic_social','sprint10','synthetic_vs_forex'],
  ['Pinterest','pinterest','organic_social','sprint10','checklist']
];
function campaignUrl(source,medium,campaign,content){
  const u=new URL(campaignBase);u.searchParams.set('utm_source',source);u.searchParams.set('utm_medium',medium);u.searchParams.set('utm_campaign',campaign);u.searchParams.set('utm_content',content);return u.href;
}
window.renderCampaignLinks=()=>{const box=document.querySelector('#campaignLinks');if(!box)return;box.innerHTML=CAMPAIGNS.map(([name,s,m,c,k])=>`<div class="campaignrow"><div><b>${name}</b><small>${campaignUrl(s,m,c,k)}</small></div><button type="button" data-copy="${campaignUrl(s,m,c,k)}">Copier</button></div>`).join('');box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copié ✓';setTimeout(()=>b.textContent='Copier',1200)})};
