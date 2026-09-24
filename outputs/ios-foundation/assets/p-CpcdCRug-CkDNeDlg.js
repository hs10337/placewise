import{N as s,O as r,P as a,Q as i,R as m}from"./navigation-jWvt844p.js";import"./use-appearance-DaDbeCK5.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const p=()=>{const e=window;e.addEventListener("statusTap",(()=>{s((()=>{const n=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!n)return;const t=r(n);t&&new Promise((o=>a(t,o))).then((()=>{i((async()=>{t.style.setProperty("--overflow","hidden"),await m(t,300),t.style.removeProperty("--overflow")}))}))}))}))};export{p as startStatusTap};
