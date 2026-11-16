/* Final da missão: R-1 volta à garagem → parabéns com galeria e métricas → decolagem 3D → cartões postais → Terra */
(function(){
const F=()=>TEXTOS["pt-BR"].ui.final;
const fmt=(s,a)=>String(s).replace(/\{(\d)\}/g,(_,i)=>a[i]);
const vitoriaAntigaG=window.vitoriaG;
window.vitoriaG=function(){finalG()};

function esperaG(cond,max){return new Promise(r=>{const t0=performance.now();const f=()=>{if(cond()||performance.now()-t0>max)r();else setTimeout(f,150)};f()})}

async function finalG(){const S=JG.S;document.querySelectorAll(".jg-modal").forEach(m=>m.remove());
  try{modoG("base")}catch(e){}
  const r=S.robo;
  if(r&&r.estado!=="casa"){toastG({ey:"R-1",txt:F().robo_volta,dur:6000});
    if(r.estado==="fora"){r.volta=agoraG()}// chega já: o laço do robô dirige até a garagem
    await esperaG(()=>S.robo.estado==="casa",10000);
    if(S.robo.estado!=="casa"){JG.movR=null;Object.assign(S.robo,{estado:"casa",x:GARAGEM.x,z:GARAGEM.z,ang:Math.PI/2})}
    salvarGale()}
  toastG({ey:"R-1",txt:F().robo_casa,dur:4000});
  setTimeout(parabensG,1200)}

function galeriaG(){const S=JG.S,l=[];
  (S.feitas||[]).slice().sort((a,b)=>a-b).forEach(k=>{const e=ETAPAS[k-1];if(e&&e.img)l.push({url:GALE_IMG+e.img+".webp",leg:e.leg||e.ponto,cred:e.cred||"NASA/JPL-Caltech",tag:fmt(F().etapa,[k])})});
  const v=window.NASA_VIVO&&NASA_VIVO.fotos&&NASA_VIVO.fotos.fotos;
  (v||[]).slice(0,3).forEach(f=>l.push({url:f.url,leg:fmt(F().foto_bruta,[f.sol]),cred:"NASA/JPL-Caltech",tag:F().radio}));
  return l}

function metricasG(){const S=JG.S;let tot=0;try{tot=pontosG().total}catch(e){}
  return [["☀️",F().m_sois,S.fim||S.sol],["⭐",F().m_estrelas,S.pontos||0],["🎯",F().m_missao,tot],["📍",F().m_etapas,(S.feitas||[]).length+" / 6"],
    ["🧩",F().m_minijogos,S.misFeitas||0],["🖨️",F().m_impressas,S.impressas||0],["🏅",F().m_medalhas,(S.medalhas||[]).length+" / "+(typeof MEDALHAS!=="undefined"?MEDALHAS.length:"?")]]}

function parabensG(){const S=JG.S;try{medalhasCheckG()}catch(e){}try{somG("medalha")}catch(e){}
  const gal=galeriaG();
  const j=janG({titulo:F().parabens_t,ey:"MARS-01",html:`<div class="jg-vit">🏆</div><p class="fin-msg">${F().parabens_txt}</p>
    <div class="fin-met">${metricasG().map(([i,n,v])=>`<div><span>${i}</span><b>${v}</b><small>${n}</small></div>`).join("")}</div>
    <h3>${F().galeria_t}</h3><p class="jg-ey">${fmt(F().galeria_d,[gal.length])}</p>
    <div class="fin-gal">${gal.map(g=>`<figure><img src="${g.url}" alt="${g.leg}" loading="lazy"><figcaption><em>${g.tag}</em>${g.leg}<small>${g.cred}</small></figcaption></figure>`).join("")}</div>
    <div class="jg-acoes"><button class="jg-bt prim" data-a="t">${F().voltar_terra}</button><button class="jg-bt" data-a="r">${TXT("ui.jogo.ver_relatorio")}</button></div>`});
  j.el.querySelector("[data-a=r]").onclick=()=>{j.fechar();relatorioG()};
  j.el.querySelector("[data-a=t]").onclick=()=>{j.fechar();decolaG()}}
window.parabensG=parabensG;window.galeriaFimG=galeriaG;

function decolaG(){const S=JG.S,B=JG.base,n=B&&B.nave;try{modoG("base")}catch(e){}
  S.heroi.dentro="nave";S.heroi.carga=null;salvarGale();
  if(!n){postaisG();return}
  toastG({ey:"MARS-01",txt:F().decolando,dur:3500});
  const y0=n.position.y,t0=performance.now(),D=reduce?600:3200;let poeira=0;
  const f=now=>{const u=Math.min(1,(now-t0)/D);
    n.position.y=y0+(u<.15?Math.sin(u*80)*.04:Math.pow((u-.15)/.85,2)*40);
    n.rotation.y+=.01;
    if(B.fx&&now-poeira>120&&u<.6){poeira=now;B.fx.explode(n.position.x,n.position.z,25)}
    if(u<1)requestAnimationFrame(f);else{n.visible=false;postaisG()}};
  requestAnimationFrame(f)}

const POSTAIS=[
  {cls:"p1",cena:`<div class="ceu"></div><div class="sol"></div><div class="morro"></div><div class="chao"></div><div class="nave">🚀</div><div class="r1">🤖</div>`,k:"p1"},
  {cls:"p2",cena:`<div class="estrelas"></div><div class="marte"></div><div class="terra"></div><div class="nave">🚀</div><div class="rastro"></div>`,k:"p2"},
  {cls:"p3",cena:`<div class="ceu"></div><div class="mar"></div><div class="paraq">🪂</div><div class="capsula"></div>`,k:"p3"},
  {cls:"p4",cena:`<div class="ceu"></div><div class="grama"></div><div class="gente">🧑‍🚀🎉👨‍👩‍👧</div><div class="bandeira">🏁</div>`,k:"p4"}];

function postaisG(){const S=JG.S;let i=0;const o=document.createElement("div");o.className="fin-post";document.body.appendChild(o);
  const pinta=()=>{const p=POSTAIS[i],ult=i===POSTAIS.length-1;
    o.innerHTML=`<div class="fin-cartao ${p.cls}"><div class="fin-ilu" aria-hidden="true">${p.cena}</div><div class="fin-verso"><span class="selo">${F()[p.k+"_selo"]}</span><h2>${F()[p.k+"_t"]}</h2><p>${F()[p.k+"_txt"]}</p>
      ${ult?`<p class="fin-assina">${fmt(F().assina,[S.fim||S.sol,(S.feitas||[]).length])}</p>`:""}
      <div class="fin-pontos">${POSTAIS.map((_,k)=>`<i class="${k===i?"on":""}"></i>`).join("")}</div>
      <div class="jg-acoes">${ult?`<button class="jg-bt prim" data-a="de_novo">${F().jogar_de_novo}</button><button class="jg-bt" data-a="fechar">${F().ficar}</button>`:`<button class="jg-bt prim" data-a="prox">${F().proximo}</button>`}</div></div></div>`;
    const b=a=>o.querySelector(`[data-a=${a}]`);
    if(b("prox"))b("prox").onclick=()=>{i++;pinta()};
    if(b("de_novo"))b("de_novo").onclick=()=>{try{localStorage.removeItem(SALVO)}catch(e){}location.reload()};
    if(b("fechar"))b("fechar").onclick=()=>{o.remove();if(JG.base&&JG.base.nave){JG.base.nave.visible=true;JG.base.nave.position.y=0}S.heroi.dentro=null;salvarGale()};
    const f=o.querySelector(".jg-bt");if(f)f.focus()};
  pinta()}
window.postaisG=postaisG;window.vitoriaAntigaG=vitoriaAntigaG;

const css=document.createElement("style");css.textContent=`
.fin-msg{font-size:1.05rem}
.fin-met{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin:12px 0}
.fin-met div{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px;text-align:center;display:flex;flex-direction:column;gap:2px}
.fin-met span{font-size:1.3rem}.fin-met b{font-size:1.25rem}.fin-met small{opacity:.75;font-size:.75rem}
.fin-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin:8px 0 14px}
.fin-gal figure{margin:0;background:rgba(0,0,0,.3);border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.1)}
.fin-gal img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#3a2218}
.fin-gal figcaption{padding:6px 8px;font-size:.78rem;display:flex;flex-direction:column;gap:2px}
.fin-gal em{font-style:normal;font-weight:700;color:#f4b860;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em}
.fin-gal small{opacity:.6;font-size:.68rem}
.fin-post{position:fixed;inset:0;z-index:9999;background:rgba(5,8,16,.92);display:flex;align-items:center;justify-content:center;padding:16px;animation:finIn .5s}
@keyframes finIn{from{opacity:0}to{opacity:1}}
.fin-cartao{width:min(860px,100%);max-height:100%;overflow:auto;display:grid;grid-template-columns:1.2fr 1fr;background:#fbf4e6;color:#2a2018;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.6);border:8px solid #fff;animation:finCard .6s cubic-bezier(.2,.8,.2,1)}
@keyframes finCard{from{transform:rotate(-4deg) translateY(30px);opacity:0}to{transform:none;opacity:1}}
.fin-ilu{position:relative;min-height:300px;overflow:hidden;border-radius:6px}
.fin-ilu>div{position:absolute}
.fin-verso{padding:20px 22px;display:flex;flex-direction:column;gap:8px;border-left:2px dashed #d9c9aa;font-family:Georgia,serif}
.fin-verso h2{margin:0;font-size:1.5rem;color:#8a3b1c}.fin-verso p{margin:0;line-height:1.45}
.fin-verso .selo{align-self:flex-end;border:2px dashed #c0582d;color:#c0582d;padding:4px 8px;font:700 .75rem system-ui;transform:rotate(4deg);border-radius:4px}
.fin-assina{font-style:italic;color:#6b5540}
.fin-verso .jg-acoes{margin-top:auto}
.fin-pontos{display:flex;gap:6px}.fin-pontos i{width:8px;height:8px;border-radius:50%;background:#d9c9aa}.fin-pontos i.on{background:#c0582d}
.p1 .ceu{inset:0;background:linear-gradient(#e9a36b,#f5d3a1)}.p1 .sol{width:46px;height:46px;border-radius:50%;background:#fff3d6;left:68%;top:18%;box-shadow:0 0 30px #fff3d6}
.p1 .morro{left:-10%;right:-10%;bottom:28%;height:38%;background:#b8572e;border-radius:60% 60% 0 0}.p1 .chao{left:0;right:0;bottom:0;height:32%;background:#d47a45}
.p1 .nave{font-size:64px;left:22%;bottom:30%;animation:sobe 3s ease-in infinite}.p1 .r1{font-size:44px;right:14%;bottom:12%}
@keyframes sobe{0%{transform:translateY(0)}100%{transform:translateY(-260px)}}
.p2 .estrelas{inset:0;background:#0b1026 radial-gradient(#fff 1px,transparent 1.5px) 0 0/28px 28px}
.p2 .marte{width:90px;height:90px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e98a55,#9c3d1d);left:8%;bottom:12%}
.p2 .terra{width:110px;height:110px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#7fd0ff,#2066b0 60%,#0d3a6e);right:8%;top:10%;box-shadow:0 0 25px #4aa8ff}
.p2 .nave{font-size:44px;left:44%;top:40%;transform:rotate(-10deg)}.p2 .rastro{left:18%;top:62%;width:30%;border-top:3px dotted #ffd27a;transform:rotate(-28deg)}
.p3 .ceu{inset:0;background:linear-gradient(#5db7ee,#bfe6ff)}.p3 .mar{left:0;right:0;bottom:0;height:30%;background:linear-gradient(#2a83c4,#13598f)}
.p3 .paraq{font-size:90px;left:38%;top:6%;animation:desce 4s ease-in-out infinite alternate}.p3 .capsula{width:46px;height:40px;background:#e8e8e8;border-radius:50% 50% 8px 8px;left:44%;top:46%;animation:desce 4s ease-in-out infinite alternate}
@keyframes desce{from{transform:translateY(-10px)}to{transform:translateY(20px)}}
.p4 .ceu{inset:0;background:linear-gradient(#8fd3ff,#e8f7ff)}.p4 .grama{left:0;right:0;bottom:0;height:35%;background:#5cb85c;border-radius:50% 50% 0 0/20% 20% 0 0}
.p4 .gente{font-size:54px;left:12%;bottom:18%}.p4 .bandeira{font-size:50px;right:12%;top:14%}
@media(max-width:640px){.fin-cartao{grid-template-columns:1fr}.fin-ilu{min-height:200px}.fin-verso{border-left:0;border-top:2px dashed #d9c9aa}}
@media(prefers-reduced-motion:reduce){.fin-post *{animation:none!important}}`;
document.head.appendChild(css);
})();
