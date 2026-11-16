/* ===== Extras do jogo MARS-01: velocidade padrão, pausa congelada, escala do HUD, sons, leitura em voz alta,
   atalhos de teclado, configurações e escolha de idioma. Carregado depois de index.html, missoes.js e final.js:
   usa as funções globais do jogo e embrulha algumas delas (janG, pulsaComG, enviaRoboG, chegouRoboG, tutDesenhaG). ===== */
(function(){
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const X=(k,a)=>TXT("ui.extras."+k,a);

/* ---------- idiomas ---------- */
const IDIOMAS=[["pt-BR","Português"],["en","English"],["es","Español"]];
window.IDIOMAS_G=IDIOMAS;
function trocaIdiomaG(l){if(l===IDIOMA)return;try{if(typeof salvarGale==="function")salvarGale()}catch(e){}LS("idioma",l);
  try{if(typeof JG!=="undefined"&&JG&&JG.S)sessionStorage.setItem("mars01-retoma",document.querySelector(".ex-cfg")?"config":"1")}catch(e){}
  const u=new URL(location.href);u.searchParams.set("lang",l);location.href=u.toString()}
window.trocaIdiomaG=trocaIdiomaG;
const seletorIdiomaG=cls=>`<label class="${cls||"ex-idioma"}"><span aria-hidden="true">🌐</span><span class="ex-vh">${X("idioma")}</span><select aria-label="${X("idioma")}">${IDIOMAS.map(([c,n])=>`<option value="${c}"${c===IDIOMA?" selected":""}>${n}</option>`).join("")}</select></label>`;
function ligaSeletor(box){const s=box.querySelector("select");if(s)s.onchange=()=>trocaIdiomaG(s.value)}
/* tela de abertura: escolha de idioma no canto, antes de iniciar */
(function(){const c=document.getElementById("abertura");if(!c)return;const d=document.createElement("div");d.className="ex-ab-idioma";d.innerHTML=seletorIdiomaG();c.appendChild(d);ligaSeletor(d)})();
/* mapa do Sistema Solar: o mesmo seletor no rodapé */
(function(){const r=document.getElementById("rodape");if(!r)return;const d=document.createElement("span");d.className="ex-rodape-idioma";d.innerHTML=seletorIdiomaG();r.appendChild(d);ligaSeletor(d)})();

/* ---------- velocidade: 3x por padrão, a escolha fica guardada ---------- */
window.velPadraoG=()=>{const v=+LS("mars01-vel");return v>=1&&v<=3?v:3};
window.velAtualG=()=>!JG||JG.vel===undefined?velPadraoG():JG.vel;
window.guardaVelG=v=>{if(v>=1&&v<=3)LS("mars01-vel",String(v))};

/* ---------- pausa: a tela inteira congela, acinzentada, com um selo no meio ---------- */
window.pausaTelaG=function(on){const r=JG&&JG.raiz;if(!r)return;if(r.classList.contains("jg-congelado")===on)return;r.classList.toggle("jg-congelado",on);
  let p=JG.hud.querySelector(".ex-pausa");
  if(on&&!p){p=el("button",{class:"ex-pausa",type:"button","aria-label":X("continuar")});p.innerHTML=`<span class="ex-pausa-ico" aria-hidden="true">❚❚</span><b>${X("pausado")}</b><small>${X("pausado_dica")}</small>`;
    p.onclick=()=>{JG.vel=velPadraoG();filaHudG()};JG.hud.appendChild(p)}
  if(p)p.hidden=!on;if(on){pararVozG();somG("pausa")}else if(p)somG("continua")};

/* ---------- escala do HUD: em telas menores os painéis encolhem (como o zoom de 70-80% do navegador), a cena 3D não ---------- */
function escalaHudG(){const r=document.getElementById("jogo-gale");if(!r)return;const w=innerWidth,h=innerHeight;
  const e=w<=760?1:Math.max(.88,Math.min(1,w/1440,h/800));/* piso maior: no notebook os painéis estavam pequenos demais */r.style.setProperty("--jg-esc",e.toFixed(3));if((typeof JG!=="undefined"&&JG))JG.painDirty=true}
addEventListener("resize",escalaHudG);

/* ---------- sons (sintetizados: nada para baixar) ---------- */
Object.assign(SONS,{erro:[[300,.09],[220,.16]],abrir:[[740,.04],[988,.06]],fechar:[[988,.04],[740,.06]],msg:[[1319,.09],[1568,.09],[1976,.2]],
  robo_sai:[[392,.08],[523,.08],[659,.12]],robo_volta:[[659,.08],[523,.08],[784,.16]],acerto:[[784,.07],[1047,.16]],pausa:[[523,.06],[392,.1]],continua:[[392,.06],[523,.1]],nivel:[[523,.07],[659,.07],[784,.07],[1047,.07],[1319,.2]]});
const ctx=()=>{try{SOM_AC=SOM_AC||new(window.AudioContext||window.webkitAudioContext)();if(SOM_AC.state==="suspended")SOM_AC.resume();return SOM_AC}catch(e){return null}};
/* o navegador só libera o áudio depois de um toque: o primeiro toque destrava */
addEventListener("pointerdown",()=>{if(SOM_AC&&SOM_AC.state==="suspended")SOM_AC.resume()},true);
let ruidoBuf=null;const ruido=ac=>{if(ruidoBuf)return ruidoBuf;const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return ruidoBuf=b};
/* ruído curto filtrado: passo na areia, clique do contador de radiação */
function chiadoG(freq,dur,vol,tipo){if(!somLigadoG())return;const ac=ctx();if(!ac)return;try{const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),q=ac.currentTime;
  s.buffer=ruido(ac);f.type=tipo||"bandpass";f.frequency.value=freq;f.Q.value=1.2;g.gain.setValueAtTime(vol,q);g.gain.exponentialRampToValueAtTime(.0001,q+dur);
  s.connect(f).connect(g).connect(ac.destination);s.start(q,Math.random()*1.5);s.stop(q+dur+.02)}catch(e){}}
window.ambienteLigadoG=()=>LS("mars01-amb")!=="0";
/* vento contínuo: baixinho no dia comum, forte na tempestade de poeira; zumbido do rover quando o astronauta dirige */
let vento=null,motor=null;
function ambienteG(){const ac=SOM_AC;if(!ac||ac.state!=="running")return;
  if(!vento){try{const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=ruido(ac);s.loop=true;f.type="lowpass";f.frequency.value=420;g.gain.value=0;s.connect(f).connect(g).connect(ac.destination);s.start();vento={f,g}}catch(e){return}}
  if(!motor){try{const o=ac.createOscillator(),g=ac.createGain();o.type="sawtooth";o.frequency.value=55;const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=260;g.gain.value=0;o.connect(f).connect(g).connect(ac.destination);o.start();motor={o,g}}catch(e){}}
  const S=JG&&JG.S,ativo=!!S&&ambienteLigadoG()&&somLigadoG()&&!document.hidden&&!JG.raiz.classList.contains("jg-congelado");
  const tmp=ativo&&S.modo==="base"?(JG.tmp||0):0,alvoV=ativo?(S.modo==="base"?.018+.11*tmp:.01):0,t=ac.currentTime;
  vento.g.gain.setTargetAtTime(alvoV,t,.6);vento.f.frequency.setTargetAtTime(380+900*tmp,t,.8);
  const dirige=ativo&&S.heroi.dentro==="rover"&&JG.mov&&JG.mov.quem==="heroi"&&velAtualG()>0;
  if(motor){motor.g.gain.setTargetAtTime(dirige?.035:0,t,.15);motor.o.frequency.setTargetAtTime(dirige?62+8*Math.random():50,t,.3)}}
function paraAmbienteG(){const t=SOM_AC?SOM_AC.currentTime:0;if(vento)vento.g.gain.setTargetAtTime(0,t,.2);if(motor)motor.g.gain.setTargetAtTime(0,t,.1)}
/* passos e contador de radiação: chamados a cada quadro pelo laço do jogo */
let passoT=0,geigerT=0;
window.sonsQuadroG=function(dt,pausado){if(!JG||!JG.S)return;const S=JG.S,v=velAtualG();
  if(!pausado&&v>0&&S.modo==="base"&&JG.mov&&JG.mov.quem==="heroi"&&!S.heroi.dentro){passoT-=dt*v;if(passoT<=0){passoT=.6;chiadoG(900+Math.random()*500,.07,.05)}}else passoT=0;
  if(!pausado&&S.modo==="base"&&S.rad>0&&!S.heroi.dentro){geigerT-=dt;if(geigerT<=0){geigerT=.05+Math.random()*.35;chiadoG(3200,.012,.06,"highpass")}}};
setInterval(()=>{if((typeof JG!=="undefined"&&JG)&&JG.S)ambienteG();else paraAmbienteG()},300);

/* ---------- leitura em voz alta ---------- */
window.vozLigadaG=()=>LS("mars01-voz")==="1";
const VOZ_LANG={"pt-BR":"pt-BR",en:"en-US",es:"es-ES"};
const limpaG=t=>String(t||"").replace(/<[^>]+>/g," ").replace(/[\u{1F000}-\u{1FFFF}☀-➿️]/gu,"").replace(/×/g," x ").replace(/\s+/g," ").trim();
window.vozG=function(txt,forcar){if(!forcar&&!vozLigadaG())return;try{const s=window.speechSynthesis;if(!s)return;const t=limpaG(txt);if(!t)return;s.cancel();
  const u=new SpeechSynthesisUtterance(t.slice(0,900)),lg=VOZ_LANG[IDIOMA]||IDIOMA;u.lang=lg;const pre=lg.slice(0,2).toLowerCase(),vs=s.getVoices();
  const v=vs.find(q=>q.lang.replace("_","-").toLowerCase()===lg.toLowerCase())||vs.find(q=>q.lang.toLowerCase().startsWith(pre));if(v)u.voice=v;u.rate=.97;s.speak(u)}catch(e){}};
window.pararVozG=()=>{try{window.speechSynthesis&&window.speechSynthesis.cancel()}catch(e){}};
window.falaVozG=txt=>vozG(txt,true);// o botão de ouvir das missões usa o idioma escolhido
/* o que ler numa janela: a mensagem aberta em Comunicações, ou o título e os primeiros parágrafos */
function textoJanG(m){const art=m.querySelector(".jg-cgrid article");if(art){const h=art.querySelector("h3"),p=art.querySelector("p");return (h?h.textContent+". ":"")+(p?p.textContent:"")}
  const h=m.querySelector("h2"),ps=[...m.querySelectorAll(".jg-corpo p, .jg-corpo li, .jg-corpo h3")].filter(e=>e.offsetParent&&!e.closest("button")).slice(0,4);return (h?h.textContent+". ":"")+ps.map(p=>p.textContent).join(" ")}

/* ---------- embrulhos: janelas, mensagens, robô, tutorial ---------- */
const janOrig=janG;
window.janG=function(o){const j=janOrig(o),m=j.el;somG("abrir");
  if(window.speechSynthesis){const hd=m.querySelector("header"),b=el("button",{class:"ex-ouvir",type:"button","aria-label":X("ouvir")},"🔊");b.title=X("ouvir");
    b.onclick=e=>{e.stopPropagation();vozG(textoJanG(m),true)};const x=hd&&hd.querySelector(".x");if(hd)hd.insertBefore(b,x||null)}
  if(vozLigadaG()){setTimeout(()=>{if(document.contains(m))vozG(textoJanG(m))},350);
    const art=m.querySelector(".jg-cgrid article");if(art){let ult="";new MutationObserver(()=>{const t=textoJanG(m);if(t!==ult&&document.contains(m)){ult=t;vozG(t)}}).observe(art,{childList:true})}}
  const f=j.fechar,fecha=()=>{pararVozG();somG("fechar");f()};j.fechar=fecha;m._fechar=fecha;const xb=m.querySelector("header .x");if(xb&&m._fechavel)xb.onclick=fecha;return j};
if(typeof pulsaComG==="function"){const o=pulsaComG;window.pulsaComG=function(){somG("msg");return o.apply(this,arguments)}}
if(typeof enviaRoboG==="function"){const o=enviaRoboG;window.enviaRoboG=function(){const r=o.apply(this,arguments);somG("robo_sai");return r}}
if(typeof chegouRoboG==="function"){const o=chegouRoboG;window.chegouRoboG=function(){const r=o.apply(this,arguments);somG("robo_volta");return r}}
if(typeof tutDesenhaG==="function"){const o=tutDesenhaG;window.tutDesenhaG=function(){const r=o.apply(this,arguments);try{const p=JG.hud.querySelector(".jg-tut-b p");if(p)vozG(p.textContent)}catch(e){}return r}}
/* o balão do astronauta e as dicas importantes: lidos quando mudam (se a leitura estiver ligada) */
function observaHudG(){const f=JG.hud.querySelector(".jg-fala");if(f){let ult="";new MutationObserver(()=>{const t=f.hidden?"":f.textContent;if(t&&t!==ult&&!JG.raiz.querySelector(".jg-modal")){ult=t;vozG(t)}}).observe(f,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:["hidden"]})}}

/* ---------- configurações (Menu) ---------- */
window.configG=function(){const lig=(id,on,t,d)=>`<label class="ex-cfg-op"><input type="checkbox" data-c="${id}"${on?" checked":""}><span><b>${t}</b><small>${d}</small></span></label>`;
  const v=velPadraoG(),j=janG({titulo:X("config"),classe:"estreita",html:`<div class="ex-cfg">
    <div class="ex-cfg-op"><span><b>${X("idioma")}</b><small>${X("idioma_d")}</small></span>${seletorIdiomaG("ex-idioma ex-idioma-cfg")}</div>
    ${lig("som",somLigadoG(),X("efeitos"),X("efeitos_d"))}${lig("amb",ambienteLigadoG(),X("ambiente"),X("ambiente_d"))}
    ${window.speechSynthesis?lig("voz",vozLigadaG(),X("voz"),X("voz_d")):`<p class="ex-cfg-sem">${X("voz_sem")}</p>`}
    <div class="ex-cfg-op"><span><b>${X("vel_padrao")}</b><small>${X("vel_padrao_d")}</small></span><span class="ex-cfg-vel" role="group" aria-label="${X("vel_padrao")}">${[1,2,3].map(n=>`<button type="button" data-v="${n}" aria-pressed="${n===v}">${n}x</button>`).join("")}</span></div>
    <p class="ex-cfg-atalhos">${X("atalhos")}</p></div>`});
  ligaSeletor(j.el);
  j.el.querySelectorAll("input[data-c]").forEach(i=>i.onchange=()=>{const c=i.dataset.c;
    if(c==="som"){LS("mars01-som",i.checked?"1":"0");const b=JG.hud.querySelector(".jg-som");if(b)somBotaoG(b);if(i.checked)somG("pegar")}
    else if(c==="amb")LS("mars01-amb",i.checked?"1":"0");
    else if(c==="voz"){LS("mars01-voz",i.checked?"1":"0");if(i.checked)vozG(X("voz_ok"));else pararVozG()}});
  j.el.querySelector(".ex-cfg-vel").onclick=e=>{const b=e.target.closest("button");if(!b)return;guardaVelG(+b.dataset.v);j.el.querySelectorAll(".ex-cfg-vel button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    if(velAtualG()>0){JG.vel=+b.dataset.v;filaHudG()}}};

/* ---------- atalhos: espaço pausa/continua, 1-3 velocidade, M mensagens, C computador ---------- */
addEventListener("keydown",e=>{if(!(typeof JG!=="undefined"&&JG)||!JG.S||e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;const t=e.target;
  if(t&&(t.tagName==="INPUT"||t.tagName==="SELECT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;if(JG.raiz.querySelector(".jg-modal")||JG.tut)return;
  if(e.key===" "&&!(t&&t.tagName==="BUTTON")){e.preventDefault();JG.vel=velAtualG()===0?velPadraoG():0;filaHudG()}
  else if(e.key==="1"||e.key==="2"||e.key==="3"){JG.vel=+e.key;guardaVelG(JG.vel);filaHudG()}
  else if(e.key==="m"||e.key==="M")abrirComG();
  else if((e.key==="c"||e.key==="C")&&JG.S.modo==="base")abrirComputadorG(true)});

/* ---------- ao entrar no jogo ---------- */
const iniOrig=iniciarGale;
window.iniciarGale=function(l){const r=iniOrig.apply(this,arguments);if((typeof JG!=="undefined"&&JG)){escalaHudG();try{observaHudG()}catch(e){}}return r};
const sairOrig=sairGale;
window.sairGale=function(){pararVozG();paraAmbienteG();return sairOrig.apply(this,arguments)};

/* ---------- estilos ---------- */
const css=`
.ex-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.ex-idioma{display:inline-flex;align-items:center;gap:6px;font:600 14px "Exo 2",system-ui,sans-serif;color:#eef6fa}
.ex-idioma select{font:inherit;color:#eef6fa;background:rgba(8,14,22,.8);border:1px solid rgba(143,240,255,.45);border-radius:999px;padding:5px 10px;cursor:pointer}
.ex-idioma select:focus-visible{outline:2px solid #8ff0ff;outline-offset:2px}
.ex-ab-idioma{position:absolute;top:max(14px,env(safe-area-inset-top,0px));right:max(14px,env(safe-area-inset-right,0px));z-index:5}
.ex-rodape-idioma{margin-left:12px}
@media (min-width:761px){#jogo-gale :is(.jg-rec,.jg-tarefas,.jg-topo,.jg-fala,.jg-dica,.jg-tit,.jg-selo,.jg-zoom,.jg-rev,.jg-ajuda,.jg-dorme,.jg-segue,.jg-rosto,.jg-alvos,.jg-lista,.jg-nota,.jg-fila,.jg-dos,.mis-clima){zoom:var(--jg-esc,1)}}
/* celular: a dica de baixo sobe para cima da barra de velocidade e o dosímetro fica mais estreito, sem cobrir nada */
@media (max-width:760px){#jogo-gale .jg-dica{bottom:calc(max(12px,env(safe-area-inset-bottom,0px)) + 198px)!important}#jogo-gale .jg-dos{width:165px}}
/* o título do topo mantém a distância da seta do norte mesmo encolhido */
@media (min-width:761px){#jogo-gale .jg-tit{top:calc((max(2px,env(safe-area-inset-top,0px)) + 40px) / var(--jg-esc,1))}#jogo-gale .jg-fila{top:calc((max(12px,env(safe-area-inset-top,0px)) + 78px) / var(--jg-esc,1))}#jogo-gale .jg-nota{top:calc((max(12px,env(safe-area-inset-top,0px)) + 132px) / var(--jg-esc,1))}}
/* o título do painel não quebra com o aviso de pausa: a janela aberta já mostra que o jogo parou */
#jogo-gale .jg-tempo .jg-pausa{display:none}
/* no computador o mapa da base não tem o que mostrar */
#jogo-gale.ex-gale .jg-mini{display:none}
/* o aviso do mapa de Gale some depois de lido, para não cobrir os pontos */
#jogo-gale .jg-nota:not([hidden]){animation:exNota .6s 9s forwards}
@keyframes exNota{to{opacity:0;visibility:hidden}}
/* o balão do astronauta não fica por cima do dosímetro */
#jogo-gale .jg-hud:has(.jg-fala:not([hidden])) .jg-dos{opacity:0;pointer-events:none}
/* pausa: tudo cinza e parado */
#jogo-gale.jg-congelado canvas.jg-3d{filter:grayscale(1) brightness(.5)}
#jogo-gale.jg-congelado .jg-hud>:not(.jg-fila):not(.jg-topo):not(.ex-pausa):not(.jg-toast):not(.jg-tut){filter:grayscale(1);opacity:.45;pointer-events:none}
#jogo-gale.jg-congelado .jg-topo .jg-mini{filter:grayscale(1);opacity:.45;pointer-events:none}
#jogo-gale.jg-congelado .jg-fila,#jogo-gale.jg-congelado .jg-topo{z-index:4}
.ex-pausa{position:absolute;inset:0;z-index:3;display:grid;place-content:center;justify-items:center;gap:6px;border:0;margin:0;padding:0;background:rgba(24,24,28,.28);color:#fff;cursor:pointer;font:inherit;text-align:center}
.ex-pausa[hidden]{display:none}
.ex-pausa-ico{font-size:clamp(38px,7vw,72px);line-height:1;opacity:.9}
.ex-pausa b{font:800 clamp(28px,5vw,52px) "Orbitron","Exo 2",system-ui,sans-serif;letter-spacing:.14em;text-shadow:0 2px 14px rgba(0,0,0,.7)}
.ex-pausa small{font-size:15px;opacity:.85;text-shadow:0 1px 6px rgba(0,0,0,.8)}
.ex-pausa:focus-visible{outline:3px solid #8ff0ff;outline-offset:-6px}
/* botão de ouvir no cabeçalho das janelas */
.jg-jan header .ex-ouvir{margin-left:auto;background:none;border:1px solid rgba(143,240,255,.35);color:#eef6fa;border-radius:999px;padding:3px 9px;font-size:15px;cursor:pointer}
.jg-jan header .ex-ouvir+.x{margin-left:8px}
.jg-jan header .ex-ouvir:hover{border-color:#8ff0ff}
/* configurações */
.ex-cfg{display:grid;gap:10px}
.ex-cfg-op{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 12px;border:1px solid rgba(143,240,255,.2);border-radius:12px;cursor:pointer}
.ex-cfg-op>span:first-child,.ex-cfg-op>input+span{display:grid;gap:2px}
.ex-cfg-op small{color:#a9bac5;font-size:13px}
.ex-cfg-op input{width:22px;height:22px;accent-color:#3fd0f0;flex:none;order:2}
.ex-cfg-op .ex-cfg-vel{display:inline-flex;gap:4px;flex:none}
.ex-cfg-vel button{font:700 14px "Exo 2",system-ui,sans-serif;color:#eef6fa;background:rgba(255,255,255,.06);border:1px solid rgba(143,240,255,.3);border-radius:8px;padding:5px 10px;cursor:pointer}
.ex-cfg-vel button[aria-pressed=true]{background:#8ff0ff;color:#06222b}
.ex-cfg-atalhos,.ex-cfg-sem{font-size:13px;color:#a9bac5;margin:4px 0 0}
`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
})();
