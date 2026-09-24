import{a5 as a,a6 as s,a7 as r,a8 as i,a9 as m}from"./navigation-BTXhBZdD.js";import"./use-appearance-YbpztM9q.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const p=()=>{const e=window;e.addEventListener("statusTap",(()=>{a((()=>{const n=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!n)return;const t=s(n);t&&new Promise((o=>r(t,o))).then((()=>{i((async()=>{t.style.setProperty("--overflow","hidden"),await m(t,300),t.style.removeProperty("--overflow")}))}))}))}))};export{p as startStatusTap};
