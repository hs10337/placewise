import{z as r,l as s,a,J as i,c}from"./ios-foundation-DcfUKbPf.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const m=()=>{const e=window;e.addEventListener("statusTap",(()=>{r((()=>{const n=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!n)return;const t=s(n);t&&new Promise((o=>a(t,o))).then((()=>{i((async()=>{t.style.setProperty("--overflow","hidden"),await c(t,300),t.style.removeProperty("--overflow")}))}))}))}))};export{m as startStatusTap};
