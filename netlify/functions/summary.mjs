import {getStore,getDeployStore} from '@netlify/blobs';
const auth=req=>{const t=Netlify.env.get('RAE_ADMIN_TOKEN');return !!t&&req.headers.get('authorization')===`Bearer ${t}`};
const isProd=()=>Netlify.context?.deploy?.context==='production';
const storeFor=name=>isProd()?getStore(name):getDeployStore(name);
async function all(store){const {blobs}=await store.list();return Promise.all(blobs.map(x=>store.get(x.key,{type:'json'})))}
export default async(req)=>{if(!auth(req))return new Response('Unauthorized',{status:401});const [ev,be]=await Promise.all([all(storeFor('rae-events')),all(storeFor('rae-business-events'))]);const visitors=new Set(ev.map(x=>x?.visitorId).filter(Boolean)).size,qualified=ev.filter(x=>x?.event==='qualification_complete').length,affiliateClicks=ev.filter(x=>x?.event==='affiliate_click').length,telegramClicks=ev.filter(x=>x?.event==='telegram_join_click').length,whatsappClicks=ev.filter(x=>x?.event==='whatsapp_join_click').length,commission=be.filter(x=>x?.event==='commission').reduce((s,x)=>s+(Number(x.amount)||0),0);const brokerClicks={deriv:0,hfm:0};for(const x of ev)if(x?.event==='affiliate_click'&&brokerClicks[x?.props?.broker]!==undefined)brokerClicks[x.props.broker]++;const campaigns={};for(const x of ev){const k=x?.utm?.campaign||'none';if(!campaigns[k])campaigns[k]={events:0,visitors:new Set(),qualified:0,clicks:0};campaigns[k].events++;if(x?.visitorId)campaigns[k].visitors.add(x.visitorId);if(x?.event==='qualification_complete')campaigns[k].qualified++;if(x?.event==='affiliate_click')campaigns[k].clicks++}const breakdown={};
for(const x of ev){
 const source=x?.utm?.source||'direct',content=x?.utm?.content||'none',key=source+'|'+content;
 if(!breakdown[key])breakdown[key]={source,content,visitors:new Set(),qualified:0,clicks:0,communityClicks:0};
 if(x?.visitorId)breakdown[key].visitors.add(x.visitorId);
 if(x?.event==='qualification_complete')breakdown[key].qualified++;
 if(x?.event==='affiliate_click')breakdown[key].clicks++;
 if(x?.event==='telegram_join_click'||x?.event==='whatsapp_join_click')breakdown[key].communityClicks++;
}
const acquisition=Object.values(breakdown).map(v=>({source:v.source,content:v.content,visitors:v.visitors.size,qualified:v.qualified,clicks:v.clicks,communityClicks:v.communityClicks,qualificationRate:v.visitors?Math.round(v.qualified/v.visitors*100):0,clickRate:v.qualified?Math.round(v.clicks/v.qualified*100):0}));
const businessByBroker={deriv:{broker_signup:0,first_deposit:0,first_trade:0,active_trader:0,commission:0},hfm:{broker_signup:0,first_deposit:0,first_trade:0,active_trader:0,commission:0}};
for(const x of be){const b=x?.broker;if(!businessByBroker[b])continue;if(x?.event==='commission')businessByBroker[b].commission+=Number(x.amount)||0;else if(Object.hasOwn(businessByBroker[b],x?.event))businessByBroker[b][x.event]++;}
const verifiedTotals={broker_signup:0,first_deposit:0,first_trade:0,active_trader:0,commission:0};
for(const b of Object.values(businessByBroker))for(const k of Object.keys(verifiedTotals))verifiedTotals[k]+=b[k]||0;
const recommendations=acquisition.map(x=>{let status='LEARN';let reason='Données insuffisantes';if(x.visitors>=20&&x.qualificationRate<20){status='CORRECT';reason='Qualification faible';}else if(x.qualified>=10&&x.clickRate<15){status='CORRECT';reason='Peu de clics après qualification';}else if(x.visitors>=20&&x.qualificationRate>=35&&x.clickRate>=25){status='CONTINUE';reason='Progression funnel encourageante';}return {...x,status,reason};});
const campaignSummary=Object.fromEntries(Object.entries(campaigns).map(([k,v])=>[k,{events:v.events,visitors:v.visitors.size,qualified:v.qualified,clicks:v.clicks}]));return Response.json({visitors,qualified,affiliateClicks,brokerClicks,telegramClicks,whatsappClicks,commission,verifiedTotals,businessByBroker,campaigns:campaignSummary,acquisition,recommendations,events:ev.length,businessEvents:be.length})};
export const config={path:'/api/summary'};
