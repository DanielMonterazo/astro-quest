/* Minijogos curtos e lúdicos (trazidos da versão do Pedro) que entram como missões da base,
   intercalados com os jogos de decisão e quiz com dados reais. Cada missão termina mostrando o dado real da NASA por trás dela.
   Carregado depois do script principal (index.html): usa janG, aplicaFxG, TXT, TAREFAS etc. */
const misT=(k,a)=>TXT("ui.missoes."+k,a);
const SVGNS="http://www.w3.org/2000/svg";
const svgE=(t,a,pai)=>{const e=document.createElementNS(SVGNS,t);for(const k in a||{})e.setAttribute(k,a[k]);if(pai)pai.appendChild(e);return e};
const svgPt=(svg,e)=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())};
function falaVozG(txt){try{const s=window.speechSynthesis;if(!s)return;s.cancel();const u=new SpeechSynthesisUtterance(String(txt).replace(/<[^>]+>/g,"").replace(/[\u{1F000}-\u{1FFFF}☀-➿️]/gu,"").replace(/×/g," vezes "));
  u.lang="pt-BR";const v=s.getVoices().find(q=>/^pt(-|_)BR/i.test(q.lang))||s.getVoices().find(q=>/^pt/i.test(q.lang));if(v)u.voice=v;u.rate=.95;s.speak(u)}catch(e){}}
function confeteG(box){const cs=["#ffcf4a","#5fc7d9","#ff7a5a","#6fd36f","#fff"];for(let i=0;i<26;i++){const c=el("i",{class:"mis-conf"});c.style.left=Math.random()*100+"%";c.style.background=cs[i%cs.length];c.style.animationDelay=Math.random()*.4+"s";c.style.setProperty("--r",(Math.random()*720-360)+"deg");box.appendChild(c);setTimeout(()=>c.remove(),2200)}}
/* fim da missão: o dado real da NASA por trás do minijogo */
function misDadoG(box,id,depois){const tx=`${misT(id+".verso")}`;
  box.innerHTML=`<div class="mis-ganhou"><p class="mis-nova">🛰️ ${TXT("ui.missoes.dado_real")}</p><div class="mis-dado"><b>${misT(id+".fig")}</b><p>${tx}</p><small>${misT(id+".fonte")}</small></div><div class="jg-acoes"><button type="button" class="jg-bt" data-a="voz">🔊</button><button type="button" class="jg-bt prim" data-a="ok">${misT("ok")}</button></div></div>`;
  box.querySelector("[data-a=voz]").onclick=()=>falaVozG(misT(id+".fig")+". "+tx);const b=box.querySelector("[data-a=ok]");b.onclick=depois;b.focus({preventScroll:true});confeteG(box.querySelector(".mis-ganhou"))}
/* ---------- palco das missões ---------- */
/* abre a missão: janela com ícone + até 8 palavras, o palco e (se precisar) a legenda curta */
function palcoG(box,diz){box.innerHTML=`<div class="mis-palco"></div><div class="mis-leg" hidden></div>`;const pal=box.querySelector(".mis-palco"),lg=box.querySelector(".mis-leg");
  let tm=0;const DICA_MS=5000,esconde=()=>{clearTimeout(tm);const r=pal.querySelector(".mis-dica");if(r)r.hidden=true},
    mostra=()=>{if(!document.contains(pal)||pal.closest(".mis-ganhou"))return;const pr=pal.getBoundingClientRect();if(!pr.width)return;
      const es=[...pal.querySelectorAll(pal.querySelector(".mis-zona")?".mis-zona":".mis-alvo,.mis-faisca,.mis-arrasta,.mis-painel")].map(e=>e.getBoundingClientRect()).filter(q=>q.width&&q.height);
      let x0=pr.left,y0=pr.top,x1=pr.right,y1=pr.bottom;if(es.length){x0=Math.min(...es.map(q=>q.left));y0=Math.min(...es.map(q=>q.top));x1=Math.max(...es.map(q=>q.right));y1=Math.max(...es.map(q=>q.bottom))}
      const m=pal.querySelector(".mis-zona")?28:10;let r=pal.querySelector(".mis-dica");if(!r){r=el("i",{class:"mis-dica","aria-hidden":"true"});pal.appendChild(r)}
      r.style.left=Math.max(4,x0-pr.left-m)+"px";r.style.top=Math.max(4,y0-pr.top-m)+"px";r.style.width=Math.min(pr.width-8,x1-x0+2*m)+"px";r.style.height=Math.min(pr.height-8,y1-y0+2*m)+"px";r.hidden=false},
    espera=()=>{clearTimeout(tm);tm=setTimeout(mostra,DICA_MS)};
  pal.addEventListener("pointerdown",()=>{esconde();if(pal._dica)espera()},true);
  return{box,pal,leg(t,cls){lg.hidden=!t;lg.className="mis-leg"+(cls?" "+cls:"");if(t!==undefined)lg.innerHTML=t},
    /* dica sem dedo (o dedo às vezes apontava a resposta errada): se a criança fica alguns segundos sem tocar,
       um contorno pulsante circula a área onde dá para mexer (todas as peças, nunca só a certa) */
    mao(){pal._dica=true;espera()},
    semMao(){esconde();if(pal._dica)espera()},
    svg(vb){const s=svgE("svg",{viewBox:vb||"0 0 800 450",class:"mis-svg"});pal.appendChild(s);return s},
    treme(e){e=e||pal;e.classList.remove("mis-nao");void e.getBoundingClientRect();e.classList.add("mis-nao");somG("alerta")}}}
/* missão da base: ao terminar, aplica o prêmio, dá a figurinha e devolve a tarefa se a criança fechou antes */
function missaoG(id,t){const M=MIS[id],S=JG.S;let feito=false;
  const j=janG({ey:`${M.ico} ${misT(id+".nome")}`,titulo:misT(id+".diz"),classe:"jg-cena",aoFechar:()=>{if(!feito&&t&&!S.tarefas.includes(t)&&(t.ate===null||S.sol<t.ate)){S.tarefas.push(t);atualizaHudG(true)}}});
  const P=palcoG(j.corpo);
  P.ok=extra=>{if(feito)return;feito=true;setTimeout(()=>{
    const fx=Object.assign({},M.premio||{},extra&&extra.fx||{});if(Object.keys(fx).length){aplicaFxG(fx);flutuaG(nomesRecG(fx),M.onde,false)}
    if(M.comida)S.comida=Math.min(COMIDA_MAX,(S.comida||0)+M.comida);if(M.depois)M.depois();S.pontos=(S.pontos||0)+5;S.misFeitas=(S.misFeitas||0)+1;
    if(M.rec)pontoNivelG(M.rec);somG("pronto");medalhasCheckG();salvarGale();atualizaHudG(true);
    j.el.querySelector("h2").textContent=`${M.ico} ✔`;misDadoG(j.corpo,id,j.fechar)},extra&&extra.espera!==undefined?extra.espera:900)};
  M.cena(P,S);return j}
/* ---------- as 12 missões da base ---------- */
const MIS={
 /* REMS: a hora do dia muda a temperatura; o frio custa energia do traje */
 hora:{ico:"⏰",onde:"estacao",premio:{prot:6},rec:"prot",depois:()=>{JG.S.leitura=JG.S.sol},cena(P){const s=P.svg();
   const cor=t=>{const k=Math.max(0,Math.min(1,(t+74)/68)),m=(a,b)=>Math.round(a+(b-a)*k);return`rgb(${m(58,255)},${m(123,160)},${m(213,60)})`};
   svgE("path",{d:"M150 170 Q400 20 650 170",fill:"none",stroke:"#ffd36b","stroke-width":4,"stroke-dasharray":"8 10",opacity:.6},s);svgE("circle",{cx:400,cy:62,r:26,fill:"#ffd36b"},s);
   const termo=svgE("g",{transform:"translate(705 120)"},s);svgE("rect",{x:-14,y:0,width:28,height:200,rx:14,fill:"#eef1f4"},termo);const nivel=svgE("rect",{x:-7,y:190,width:14,height:4,rx:7,fill:"#4aa8ff"},termo);svgE("circle",{cx:0,cy:214,r:24,fill:"#4aa8ff"},termo);
   const ast=astronautaSvgG(s,90,150,.9);
   TEMP_G.slice(0,12).forEach(([h,t])=>{const x=60+h*24.5,g=svgE("g",{class:"mis-alvo",tabindex:0,role:"button","aria-label":h+"h"},s);svgE("rect",{x,y:300,width:44,height:90,rx:12,fill:cor(t)},g);
     const tx=svgE("text",{x:x+22,y:420,"text-anchor":"middle","font-size":20,fill:"#cfe0ee","font-weight":800},g);tx.textContent=h+"h";
     g.onclick=()=>{const custo=Math.round(2+(-6-t)/68*6);nivel.setAttribute("height",8+Math.max(0,(t+80)/80)*180);nivel.setAttribute("y",198-Math.max(0,(t+80)/80)*180);nivel.setAttribute("fill",cor(t));
       s.querySelectorAll(".mis-alvo").forEach(q=>q.classList.toggle("sel",q===g));P.semMao();
       if(custo<=3){ast.classList.remove("mis-treme");P.leg(`${h}h · ${t} °C · ⚡ −${custo} ✔`,"bom");P.ok({fx:{energia:-custo}})}else{ast.classList.add("mis-treme");P.leg(`${h}h · ${t} °C 🥶 · ⚡ −${custo}`,"ruim")}}});
   P.mao(28,78)}},
 /* REMS: pressão de Marte (~7 hPa) contra a da Terra (1013 hPa) */
 vedar:{ico:"🌬️",onde:"moradia",premio:{vida:15},rec:"vida",multa:{vida:-8},falha:true,cena(P){const s=P.svg();
   svgE("rect",{x:60,y:40,width:470,height:370,rx:36,fill:"#cfd6dc",stroke:"#8a969f","stroke-width":8},s);
   const furos=[[170,130],[400,170],[260,320]],alvo=[7,340,680,1013];let n=0;
   const terra=svgE("g",{transform:"translate(660 150)"},s);svgE("circle",{r:95,fill:"#3a8ef5",opacity:.9},terra);const te=svgE("text",{y:14,"text-anchor":"middle","font-size":44},terra);te.textContent="🌍";
   const casa=svgE("circle",{cx:660,cy:350,r:8,fill:"#e8463a"},s);
   const pinta=p=>{casa.setAttribute("r",Math.max(6,95*Math.sqrt(p/1013)));P.leg(`🌍 1013 · 🏠 ${Math.round(p)}${p>=1013?" ✔":""}`,p>=1013?"bom":"")};pinta(7);
   furos.forEach(([x,y],i)=>{const g=svgE("g",{class:"mis-alvo mis-furo",transform:`translate(${x} ${y})`},s);
     svgE("path",{d:"M-30 -24 l18 16 l-8 14 l22 18",stroke:"#2a1e18","stroke-width":7,fill:"none","stroke-linecap":"round"},g);
     const ar=svgE("g",{class:"mis-assobio"},g);[0,1,2].forEach(k=>svgE("path",{d:`M${10+k*14} ${-36-k*8} q8 -8 16 0`,stroke:"#fff","stroke-width":3,fill:"none"},ar));
     [0,1,2,3].forEach(k=>svgE("circle",{class:"mis-po",cx:-50-k*12,cy:30+k*8,r:4,fill:"#d38a55",style:`animation-delay:${k*.25}s`},g));
     const anel=svgE("circle",{r:44,fill:"none",stroke:"#6fd36f","stroke-width":8,class:"mis-anel","stroke-dasharray":"277","stroke-dashoffset":"277",transform:"rotate(-90)"},g);
     svgE("circle",{r:50,fill:"transparent"},g);let tm=null;
     const para=()=>{clearTimeout(tm);if(!g.classList.contains("ok"))anel.style.strokeDashoffset="277"};
     g.addEventListener("pointerdown",e=>{if(g.classList.contains("ok"))return;e.preventDefault();P.semMao();anel.style.strokeDashoffset="0";
       tm=setTimeout(()=>{g.classList.add("ok");somG("pegar");n++;const de=alvo[n-1],ate=alvo[n],t0=performance.now(),an=tt=>{const k=Math.min(1,(tt-t0)/600);pinta(de+(ate-de)*k);if(k<1)requestAnimationFrame(an)};requestAnimationFrame(an);if(n===3)P.ok({espera:1300})},800)});
     ["pointerup","pointerleave","pointercancel"].forEach(ev=>g.addEventListener(ev,para))});
   P.mao(23,34,"👆","segura")}},
 /* RAD + DONKI: na tempestade solar, dentro das paredes a radiação não chega */
 abrigo:{ico:"☢️",onde:"moradia",premio:{prot:10},rec:"prot",cena(P){const s=P.svg();P.pal.classList.add("mis-radiacao");
   for(let i=0;i<22;i++)svgE("circle",{class:"mis-cai",cx:20+i*36,cy:-10,r:5,fill:"#ffe36a",style:`animation-delay:${(i*.17)%1.5}s`},s);
   const dom=svgE("g",{},s);svgE("path",{d:"M470 420 v-110 a150 120 0 0 1 300 0 v110z",fill:"#d3d9de"},dom);svgE("path",{d:"M470 310 a150 120 0 0 1 300 0",fill:"none",stroke:"#6fd36f","stroke-width":12},dom);
   const ast=astronautaSvgG(s,160,250,1);const brilho=svgE("circle",{cx:160,cy:290,r:95,fill:"#ffe36a",opacity:.25},s);s.insertBefore(brilho,ast);ast.classList.add("mis-arrasta");
   let arr=null;const pos={x:160,y:250};
   ast.addEventListener("pointerdown",e=>{arr=svgPt(s,e);P.semMao();try{ast.setPointerCapture(e.pointerId)}catch(x){}});
   ast.addEventListener("pointermove",e=>{if(!arr)return;const p=svgPt(s,e);pos.x+=p.x-arr.x;pos.y+=p.y-arr.y;arr=p;ast.setAttribute("transform",`translate(${pos.x} ${pos.y})`);brilho.setAttribute("cx",pos.x);brilho.setAttribute("cy",pos.y+40)});
   ast.addEventListener("pointerup",()=>{arr=null;if(pos.x>500&&pos.x<740&&pos.y>200){pos.x=620;pos.y=300;ast.setAttribute("transform",`translate(620 300) scale(.8)`);brilho.remove();ast.classList.add("feliz");P.pal.classList.add("salvo");P.leg("😌 ☢ ✋","bom");P.ok({espera:1200})}});
   P.leg(misT("abrigue"),"ruim");P.mao(30,62,"👉","arrasta")}},
 /* DONKI: a CME leva dias; dá tempo de preparar a base (a tempestade faz metade do dano) */
 nuvem:{ico:"☁️",onde:"torre",premio:{prot:4},rec:"prot",precisa:"torre",depois:()=>{const S=JG.S;if(S.radEv){S.radEscudo=true;S.radEv.alerta=true}},cena(P,S){const s=P.svg();
   const n=S.radEv?Math.max(1,S.proxRad-S.sol):2;
   svgE("circle",{cx:80,cy:110,r:52,fill:"#ffc83a"},s);svgE("line",{x1:140,y1:110,x2:690,y2:110,stroke:"#fff","stroke-width":4,"stroke-dasharray":"10 12",opacity:.5},s);svgE("circle",{cx:720,cy:110,r:30,fill:"#d9472f"},s);
   const nv=svgE("g",{},s);[[0,0,30],[24,-10,24],[44,4,22]].forEach(([x,y,r])=>svgE("circle",{cx:x,cy:y,r,fill:"#ff8a3a",opacity:.9},nv));
   const itens=[["🔋",170],["💧",400],["🚪",630]],feitos=new Set();let x0=150,ini=performance.now(),acabou=false;const dur=12000;
   itens.forEach(([ic,x],i)=>{const g=svgE("g",{class:"mis-alvo mis-prep",transform:`translate(${x} 320)`},s);svgE("rect",{x:-70,y:-60,width:140,height:120,rx:24,fill:"#13222d",stroke:"#8ff0ff","stroke-width":4},g);const t=svgE("text",{y:22,"text-anchor":"middle","font-size":60},g);t.textContent=ic;
     g.onclick=()=>{if(acabou||feitos.has(i))return;feitos.add(i);g.classList.add("ok");t.textContent="✅";somG("pegar");P.semMao();if(feitos.size===3){acabou=true;P.leg("☁ 🛡️ ✔","bom");P.ok()}}});
   const anda=t=>{if(acabou||!document.contains(s))return;const k=Math.min(1,(t-ini)/dur);nv.setAttribute("transform",`translate(${x0+k*520} 110)`);
     if(k>=1){acabou=true;P.leg("☁💥","ruim");const b=el("button",{type:"button",class:"jg-bt mis-denovo"},misT("de_novo"));P.box.appendChild(b);b.onclick=()=>{b.remove();missaoRefazG(P,"nuvem",S)};return}requestAnimationFrame(anda)};requestAnimationFrame(anda);
   P.leg(misT("cme",[n,n===1?misT("sol1"):misT("sois")]));P.mao(21,62)}},
 /* InSight/Opportunity: poeira nos painéis = menos energia */
 paineis:{ico:"🧹",onde:"nave",premio:{energia:22},rec:"energia",multa:{energia:-4},cena(P){const w=el("div",{class:"mis-painel"},`<div class="mis-cels"></div><canvas width="640" height="320"></canvas><div class="mis-bat"><i></i></div>`);P.pal.appendChild(w);
   const cv=w.querySelector("canvas"),cx=cv.getContext("2d"),bat=w.querySelector(".mis-bat i");cx.fillStyle="#9a6236";cx.fillRect(0,0,640,320);
   for(let i=0;i<900;i++){cx.fillStyle=["#b8743f","#8a5230","#c98a55"][i%3];cx.globalAlpha=.6;cx.beginPath();cx.arc(Math.random()*640,Math.random()*320,2+Math.random()*6,0,7);cx.fill()}cx.globalAlpha=1;
   let n=0,fim=false;const limpo=()=>{const d=cx.getImageData(0,0,640,320).data;let v=0,t=0;for(let i=3;i<d.length;i+=4*97){t++;if(d[i]<40)v++}return v/t};
   const esf=e=>{if(fim||!(e.buttons||e.pointerType==="touch"))return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*640,y=(e.clientY-r.top)/r.height*320;
     cx.globalCompositeOperation="destination-out";cx.beginPath();cx.arc(x,y,34,0,7);cx.fill();cx.globalCompositeOperation="source-over";P.semMao();
     if(++n%6===0){const p=limpo();bat.style.height=Math.round(p*100)+"%";P.leg(`🔋 ${Math.round(p*100)}%`);if(p>=.8){fim=true;cx.clearRect(0,0,640,320);bat.style.height="100%";P.leg("🔋 100% ✔","bom");P.ok()}}};
   cv.addEventListener("pointerdown",e=>{try{cv.setPointerCapture(e.pointerId)}catch(x){}esf(e)});cv.addEventListener("pointermove",esf);
   P.leg("🔋 0%");P.mao(40,45,"👆","esfrega")}},
 /* gravidade de Marte: 38% da Terra → o pulo vai ~2,6× mais alto */
 pular:{ico:"🦘",onde:"moradia",premio:{prot:18,energia:-3},rec:"prot",multa:{prot:-4},depois:()=>{JG.S.exerc=(JG.S.exerc||0)+1},cena(P){const s=P.svg();
   svgE("rect",{x:0,y:380,width:800,height:70,fill:"#8a4a2c"},s);
   const terra=astronautaSvgG(s,270,250,.9);terra.classList.add("mis-fantasma");const marte=astronautaSvgG(s,530,250,.9);
   const t1=svgE("text",{x:270,y:430,"text-anchor":"middle","font-size":34},s);t1.textContent="🌍";const t2=svgE("text",{x:530,y:430,"text-anchor":"middle","font-size":34},s);t2.textContent="🔴";
   let n=0,ocup=false;P.leg(misT("leg_terra_marte",[0]));
   P.pal.onclick=()=>{if(ocup||n>=5)return;ocup=true;n++;P.semMao();somG("pegar");
     terra.style.setProperty("--h","-60px");marte.style.setProperty("--h","-156px");[terra,marte].forEach(a=>{a.classList.remove("pula");void a.getBoundingClientRect();a.classList.add("pula")});
     P.leg(misT("leg_terra_marte",[n]),n>=5?"bom":"");setTimeout(()=>{ocup=false;if(n>=5)P.ok({espera:200})},900)};
   P.mao(50,55,"👆","toca2")}},
 /* ChemCam: a luz da faísca do laser mostra do que a rocha é feita */
 lupa:{ico:"🔦",onde:"estacao",premio:{},rec:"prot",depois:()=>{JG.S.pontos=(JG.S.pontos||0)+5},cena(P){const s=P.svg();
   svgE("path",{d:"M90 380 L170 200 L420 160 L560 230 L510 400 L210 430z",fill:"#7a5a44"},s);svgE("g",{},s);
   [[260,250,"M0 0 l90 44"],[400,330,"M0 0 l70 -40"]].forEach(([x,y,d])=>svgE("path",{d,transform:`translate(${x} ${y})`,stroke:"#f1ece4","stroke-width":9,"stroke-linecap":"round"},s));
   const laser=svgE("line",{x1:340,y1:0,x2:330,y2:290,stroke:"#ff3a3a","stroke-width":4,opacity:0},s);
   const potes=[["#ff8a2a","🔩",90],["#ffffff","🦴",225],["#ffe14a","🌋",360]].map(([c,ic,y])=>{const g=svgE("g",{transform:`translate(690 ${y})`},s);svgE("rect",{x:-80,y:-52,width:160,height:104,rx:20,fill:"#13222d",stroke:c,"stroke-width":5},g);svgE("circle",{cx:-36,r:22,fill:c},g);const t=svgE("text",{x:30,y:18,"text-anchor":"middle","font-size":46},g);t.textContent=ic;return{c,y,g}});
   let feitas=0,aceso=false;
   s.addEventListener("click",e=>{if(aceso)return;const p=svgPt(s,e);if(p.x>600)return;aceso=true;laser.setAttribute("opacity",1);P.semMao();somG("pegar");
     potes.map(q=>q.c).sort(()=>Math.random()-.5).forEach((c,i)=>{const fa=svgE("circle",{cx:300+i*40,cy:280+(i%2)*26,r:16,fill:c,class:"mis-faisca"},s);let arr=null,o={x:300+i*40,y:280+(i%2)*26};
       fa.addEventListener("pointerdown",ev=>{ev.stopPropagation();arr=svgPt(s,ev);try{fa.setPointerCapture(ev.pointerId)}catch(x){}});
       fa.addEventListener("pointermove",ev=>{if(!arr)return;const q=svgPt(s,ev);fa.setAttribute("cx",q.x);fa.setAttribute("cy",q.y)});
       fa.addEventListener("pointerup",ev=>{if(!arr)return;arr=null;const q=svgPt(s,ev),pt=potes.find(k=>Math.abs(q.x-690)<85&&Math.abs(q.y-k.y)<56);
         if(pt&&pt.c===c){fa.setAttribute("cx",654);fa.setAttribute("cy",pt.y);fa.style.pointerEvents="none";pt.g.classList.add("ok");somG("pegar");if(++feitas===3)P.ok()}else{fa.setAttribute("cx",o.x);fa.setAttribute("cy",o.y);if(pt)P.treme()}})});
     P.mao(42,62,"👉","arrasta")});
   P.mao(40,55)}},
 /* Phoenix: gelo de água logo abaixo da poeira; no ar ralo ele vira vapor */
 gelo:{ico:"🧊",onde:"nave",premio:{vida:12},rec:"vida",cena(P){const s=P.svg();svgE("rect",{x:0,y:0,width:800,height:450,fill:"#9a5a34"},s);
   const tem=[0,1,2,3,4,5].sort(()=>Math.random()-.5).slice(0,2);let ach=0;
   [[150,140],[400,120],[650,150],[150,330],[400,320],[650,330]].forEach(([x,y],i)=>{const g=svgE("g",{class:"mis-alvo",transform:`translate(${x} ${y})`},s);svgE("ellipse",{rx:90,ry:50,fill:"#b8743f"},g);svgE("ellipse",{rx:60,ry:30,fill:"#a8653a"},g);
     g.onclick=()=>{if(g.classList.contains("cavado"))return;g.classList.add("cavado");P.semMao();svgE("ellipse",{rx:70,ry:38,fill:"#3a2216"},g);
       if(tem.includes(i)){ach++;somG("pegar");const ic=svgE("path",{d:"M-40 6 l18 -26 l30 4 l20 22 l-24 16 l-34 -2z",fill:"#f4fbff",class:"mis-sublima"},g);svgE("g",{class:"mis-vapor"},g);P.leg(`🧊 ${ach}/2`,ach>=2?"bom":"");if(ach>=2)P.ok({espera:1600})}
       else{const t=svgE("text",{y:12,"text-anchor":"middle","font-size":34},g);t.textContent="🟫"}}});
   P.leg("🧊 0/2");P.mao(19,36)}},
 /* Veggie: as folhas usam mais a luz vermelha e a azul */
 luz:{ico:"🥬",onde:"domo",premio:{vida:4},comida:3,rec:"vida",cena(P){const s=P.svg();
   svgE("path",{d:"M150 360 a250 230 0 0 1 500 0z",fill:"#cfe8ff",opacity:.18,stroke:"#8ff0ff","stroke-width":4},s);const brilho=svgE("path",{d:"M150 360 a250 230 0 0 1 500 0z",fill:"#000",opacity:0},s);
   svgE("rect",{x:300,y:330,width:200,height:34,rx:8,fill:"#5a3a24"},s);const pl=svgE("g",{transform:"translate(400 330) scale(.35)",class:"mis-planta"},s);
   [[-40,-30,-30],[40,-30,30],[0,-60,0],[-60,-10,-50],[60,-10,50]].forEach(([x,y,r])=>svgE("ellipse",{cx:x,cy:y,rx:34,ry:60,fill:"#5fd36f",transform:`rotate(${r} ${x} ${y})`},pl));
   const on={r:false,g:false,b:false},cores={r:"#ff3a3a",g:"#3ad35a",b:"#3a7bff"};let fim=false;
   ["r","g","b"].forEach((k,i)=>{const g=svgE("g",{class:"mis-alvo mis-led",transform:`translate(${280+i*120} 410)`},s);const c=svgE("circle",{r:28,fill:"#22303a",stroke:cores[k],"stroke-width":6},g);
     g.onclick=()=>{if(fim)return;on[k]=!on[k];c.setAttribute("fill",on[k]?cores[k]:"#22303a");P.semMao();somG("pegar");
       const mix=`rgb(${on.r?255:0},${on.g?200:0},${on.b?255:0})`,n=on.r+on.g+on.b;brilho.setAttribute("fill",mix);brilho.setAttribute("opacity",n?.22:0);
       if(on.r&&on.b){fim=true;pl.setAttribute("transform","translate(400 330) scale(1)");P.leg("🥬 +3 ✔","bom");P.ok({espera:1400})}else{pl.setAttribute("transform",`translate(400 330) scale(${(on.r||on.b)?.6:.35})`);
         if(!n)P.leg("🥬 0");else if(on.g&&!on.r&&!on.b)P.leg(misT("leg_verde"),"ruim");
         else P.leg(misT("leg_cresceu"))}}});
   P.mao(22,82)}},
 /* ISS: o reciclador devolve 98 de cada 100 gotas */
 filtro:{ico:"💧",onde:"moradia",premio:{vida:18},rec:"vida",multa:{vida:-6},falha:true,cena(P){const s=P.svg();
   svgE("rect",{x:80,y:90,width:180,height:260,rx:20,fill:"#1f3a4f",stroke:"#8ff0ff","stroke-width":4},s);const agua=svgE("rect",{x:90,y:330,width:160,height:10,rx:10,fill:"#3aa0ff"},s);
   svgE("path",{d:"M260 220 H460 V300 H560",fill:"none",stroke:"#8a969f","stroke-width":16},s);
   const slot=svgE("rect",{x:440,y:170,width:60,height:100,rx:10,fill:"#6a4a2a",stroke:"#fff","stroke-width":3,"stroke-dasharray":"8 6"},s);
   const novo=svgE("g",{class:"mis-arrasta",transform:"translate(660 140)"},s);svgE("rect",{x:-30,y:-50,width:60,height:100,rx:10,fill:"#f4fbff"},novo);[-25,0,25].forEach(y=>svgE("line",{x1:-22,y1:y,x2:22,y2:y,stroke:"#9fb6c8","stroke-width":4},novo));
   let arr=null;const o={x:660,y:140};
   novo.addEventListener("pointerdown",e=>{arr=svgPt(s,e);P.semMao();try{novo.setPointerCapture(e.pointerId)}catch(x){}});
   novo.addEventListener("pointermove",e=>{if(!arr)return;const p=svgPt(s,e);o.x+=p.x-arr.x;o.y+=p.y-arr.y;arr=p;novo.setAttribute("transform",`translate(${o.x} ${o.y})`)});
   novo.addEventListener("pointerup",()=>{arr=null;if(Math.abs(o.x-470)<70&&Math.abs(o.y-220)<80){novo.setAttribute("transform","translate(470 220)");novo.style.pointerEvents="none";slot.remove();somG("pegar");
     let n=0;const t=setInterval(()=>{n+=4;if(n>100)n=100;const v=Math.min(98,n);agua.setAttribute("height",10+v*2.3);agua.setAttribute("y",340-v*2.3);P.leg(`💧 ${v} / 100${n>=100?" ✔":""}`,n>=100?"bom":"");if(n>=100){clearInterval(t);P.ok({espera:1200})}},50)}
     else{o.x=660;o.y=140;novo.setAttribute("transform","translate(660 140)")}});
   P.leg("💧 0 / 100");P.mao(66,30,"👈","toca")}},
 /* DSN: a voz da Terra demora minutos; ouvir a família anima */
 voz:{ico:"📡",onde:"torre",premio:{prot:10},rec:"prot",precisa:"torre",cena(P){const s=P.svg();svgE("rect",{x:0,y:0,width:800,height:450,fill:"#0a1530"},s);
   [[60,40],[200,90],[520,30],[700,120],[330,60],[610,200]].forEach(([x,y])=>svgE("circle",{cx:x,cy:y,r:2,fill:"#fff"},s));
   const alvo=-35+Math.random()*70,ex=400+Math.sin(alvo*Math.PI/180)*330,ey=380-Math.cos(alvo*Math.PI/180)*330;svgE("circle",{cx:ex,cy:ey,r:22,fill:"#3a8ef5"},s);
   const ant=svgE("g",{transform:"translate(400 390)"},s);svgE("rect",{x:-8,y:-10,width:16,height:60,fill:"#8a969f"},ant);const prato=svgE("g",{},ant);svgE("path",{d:"M-60 -30 a60 40 0 0 0 120 0z",fill:"#dfe5ea"},prato);svgE("line",{x1:0,y1:-30,x2:0,y2:-80,stroke:"#dfe5ea","stroke-width":5},prato);
   const rosto=el("div",{class:"mis-rosto"},"😟");P.pal.appendChild(rosto);
   let ang=0,ok=false,arr=null;const gira=a=>{ang=Math.max(-70,Math.min(70,a));prato.setAttribute("transform",`rotate(${ang})`)};
   s.addEventListener("pointerdown",e=>{arr=e.clientX;P.semMao();try{s.setPointerCapture(e.pointerId)}catch(x){}});
   s.addEventListener("pointermove",e=>{if(arr===null||ok)return;gira(ang+(e.clientX-arr)*.4);arr=e.clientX;
     if(Math.abs(ang-alvo)<6){ok=true;arr=null;somG("pegar");const raio=svgE("line",{x1:400,y1:330,x2:ex,y2:ey,stroke:"#8ff0ff","stroke-width":3,"stroke-dasharray":"10 10",class:"mis-onda"},s);
       P.leg("⏳ 3–22 min");setTimeout(()=>{rosto.textContent="😊";rosto.classList.add("feliz");P.leg("📻 voz da Terra 💛","bom");somG("medalha");P.ok({espera:1500})},2200)}});
   s.addEventListener("pointerup",()=>{arr=null});P.mao(50,70,"👉","gira")}},
 /* o sol de Marte tem 24 h 39 min 35 s */
 dormir:{ico:"🌙",onde:"moradia",premio:{prot:8},rec:"prot",depois:()=>{JG.S.dormiuSol=JG.S.sol},cena(P){const s=P.svg();
   const R=150,cx=400,cy=220,arco=(a0,a1,r)=>{const p=a=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];const[x0,y0]=p(a0),[x1,y1]=p(a1);return`M${x0} ${y0} A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${x1} ${y1}`};
   const fr=360*24/24.66;svgE("path",{d:arco(0,fr-.5,R),fill:"none",stroke:"#3a4a5a","stroke-width":34,class:"mis-zona"},s);
   for(let h=0;h<24;h++){const a=h*fr/24;svgE("line",{x1:cx+(R-24)*Math.sin(a*Math.PI/180),y1:cy-(R-24)*Math.cos(a*Math.PI/180),x2:cx+(R-34)*Math.sin(a*Math.PI/180),y2:cy-(R-34)*Math.cos(a*Math.PI/180),stroke:"#9fb6c8","stroke-width":3},s)}
   const ouro=svgE("path",{d:arco(fr,359.5,R),fill:"none",stroke:"#ffd84a","stroke-width":50,class:"mis-ouro mis-alvo"},s);
   svgE("path",{d:arco(fr-30,359.9,R),fill:"none",stroke:"transparent","stroke-width":120,class:"mis-ouro-alvo"},s).onclick=()=>ouro.onclick();
   const t=svgE("text",{x:cx,y:cy+16,"text-anchor":"middle","font-size":54},s);t.textContent="🧑‍🚀";
   s.addEventListener("click",e=>{if(e.target===ouro||e.target.classList.contains("mis-ouro-alvo"))return;if(!t.textContent.includes("💤"))P.treme()});
   ouro.onclick=()=>{P.semMao();t.textContent="😴💤";ouro.classList.add("ok");P.leg("+39 min ☀","bom");somG("pegar");P.ok({espera:1300})};
   P.mao(52,8)}}};
const MIS_RODA=["hora","luz","lupa","gelo","voz","vedar","pular","paineis","filtro"];
function missaoRefazG(P,id,S){const M=MIS[id];P.box.innerHTML="";const N=palcoG(P.box);N.ok=P.ok;M.cena(N,S)}
/* desenho do astronauta usado nas missões */
function astronautaSvgG(s,x,y,k){const g=svgE("g",{transform:`translate(${x} ${y}) scale(${k||1})`,class:"mis-ast"},s);const i=svgE("g",{class:"mis-ast-i"},g);
  svgE("rect",{x:-36,y:30,width:72,height:90,rx:22,fill:"#eef1f4"},i);svgE("circle",{cx:0,cy:0,r:44,fill:"#eef1f4"},i);svgE("circle",{cx:0,cy:0,r:32,fill:"#1d2b3a"},i);
  svgE("circle",{cx:-11,cy:-4,r:4,fill:"#fff"},i);svgE("circle",{cx:11,cy:-4,r:4,fill:"#fff"},i);svgE("path",{d:"M-12 12 q12 8 24 0",stroke:"#fff","stroke-width":3,fill:"none",class:"boca"},i);return g}


/* cada minijogo vira uma tarefa no lugar dele (prefixo m_ para não colidir com as tarefas que já existem) */
for(const id in MIS){const M=MIS[id];TAREFAS["m_"+id]={nome:`${M.ico} ${misT(id+".nome")}`,onde:M.onde,premio:{},multa:{},jogo:t=>missaoG(id,t)}}

/* agenda: a cada sol entra um minijogo do rodízio (além do jogo de decisão/quiz de jogosSolG); na tempestade solar, correr pro abrigo */
function misSolG(){const S=JG.S;if(!prontaG(S,"moradia")||!prontaG(S,"domo"))return;
  if(S.tarefas.some(t=>/^m_/.test(t.id)&&t.id!=="m_abrigo"))return;S.misI=S.misI||0;
  for(let n=0;n<MIS_RODA.length;n++){const id=MIS_RODA[(S.misI+n)%MIS_RODA.length],M=MIS[id];if(M.precisa&&!prontaG(S,M.precisa))continue;
    S.tarefas.push({id:"m_"+id,nome:TAREFAS["m_"+id].nome,onde:M.onde,ate:S.sol+3});S.misI=(S.misI+n+1)%MIS_RODA.length;atualizaHudG(true);break}}
/* depois da tempestade de areia: a poeira cobre os painéis da nave e a torre; limpar no minijogo tira a poeira (como o kit) */
MIS.paineis.depois=()=>{const S=JG.S;if(!S.poeira)return;S.poeira=false;S.limpou=(S.limpou||0)+1;if(S.kit)S.kit.prox=S.sol+2;S.fila.push({id:"sinal",quando:S.sol+S.t})};
function misEventosG(){const S=JG.S;if(JG.tut||S.modo!=="base"||!prontaG(S,"moradia"))return;const tem=S.tarefas.some(t=>t.id==="m_abrigo");
  if(S.poeira&&!(S.temp>0)&&S.poeiraAviso!==S.tempN&&!S.tarefas.some(t=>t.id==="m_paineis")){S.poeiraAviso=S.tempN;
    S.tarefas.unshift({id:"m_paineis",nome:TAREFAS.m_paineis.nome,onde:"nave",ate:S.sol+3});atualizaHudG(true);
    toastG({ey:misT("poeira_ey"),txt:misT("poeira_txt"),dur:9000})}
  if(S.rad>0&&radAbrG()<1&&!tem&&S.abrigoAviso!==S.radN){S.abrigoAviso=S.radN;S.tarefas.unshift({id:"m_abrigo",nome:TAREFAS.m_abrigo.nome,onde:"moradia",ate:S.sol+1});atualizaHudG(true)}
  if(S.rad<=0&&tem){S.tarefas=S.tarefas.filter(t=>t.id!=="m_abrigo");atualizaHudG(true)}}

/* frio da noite: quando o astronauta está lá fora à noite, mostra a temperatura e o rosto treme */
function tempAgoraG(){const h=horaG(JG.S.t);for(let i=1;i<TEMP_G.length;i++){const[a,ta]=TEMP_G[i-1],[b,tb]=TEMP_G[i];if(h<=b)return Math.round(ta+(tb-ta)*(h-a)/(b-a))}return TEMP_G[0][1]}
function climaG(){const S=JG.S,h=JG.hud;if(!h)return;let c=h.querySelector(".mis-clima");
  if(!c){c=el("div",{class:"mis-clima"},`<div class="mis-pill mis-frio" hidden></div>`);h.appendChild(c)}
  const noite=S.modo==="base"&&!JG.tut&&!S.heroi.dentro&&noiteG(S.t)&&!(S.rad>0);const fr=c.querySelector(".mis-frio");fr.hidden=!noite;
  if(noite){const t=misT("frio",[tempAgoraG()]);if(fr.textContent!==t)fr.textContent=t}
  const ro=h.querySelector(".jg-rosto");if(ro)ro.classList.toggle("mis-treme",!!noite)}
function misQuadroG(){try{climaG();misEventosG()}catch(e){}}

/* ---------- estilos ---------- */
(function(){const css=`
.jg-cena .jg-jan{width:min(860px,100%)}
.jg-cena h2{font-size:clamp(20px,3.2vw,28px)}
.jg-cena.estreita .jg-jan,.jg-modal .jg-cena.estreita{width:min(520px,100%)}
.mis-palco{position:relative;width:100%;aspect-ratio:16/9;max-height:56vh;border-radius:14px;overflow:hidden;background:#0d1a24;touch-action:none;user-select:none;-webkit-user-select:none}
.mis-svg{position:absolute;inset:0;width:100%;height:100%}
.mis-leg{display:block;width:max-content;max-width:100%;margin:12px auto 0;background:rgba(10,22,32,.94);border:3px solid rgba(143,240,255,.7);border-radius:999px;padding:8px 22px;font-size:clamp(18px,2.6vw,26px);font-weight:900;text-align:center}
.mis-leg.bom{border-color:#6fd36f}.mis-leg.ruim{border-color:#ff7a5a}
.mis-alvo{cursor:pointer}.mis-alvo:hover{filter:brightness(1.15)}.mis-alvo.sel rect{stroke:#ffcf4a;stroke-width:6}
.mis-alvo.ok{filter:drop-shadow(0 0 10px #6fd36f)}
.mis-mao{position:absolute;z-index:3;font-size:clamp(34px,6vw,56px);font-style:normal;pointer-events:none;transform:translate(-30%,-10%);filter:drop-shadow(0 4px 6px #0008)}
.mis-mao.toca{animation:misToca 1.1s ease-in-out infinite}.mis-mao.toca2{animation:misToca .55s ease-in-out infinite}
.mis-mao.segura{animation:misSegura 1.6s ease-in-out infinite}.mis-mao.arrasta{animation:misArr 1.8s ease-in-out infinite}
.mis-mao.esfrega{animation:misEsf 1s ease-in-out infinite}.mis-mao.gira{animation:misEsf 1.4s ease-in-out infinite}
@keyframes misToca{50%{transform:translate(-30%,10%) scale(.9)}}
@keyframes misSegura{0%,100%{transform:translate(-30%,-10%)}30%,70%{transform:translate(-30%,8%) scale(.9)}}
@keyframes misArr{0%{transform:translate(-30%,-10%);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translate(200%,-10%);opacity:0}}
@keyframes misEsf{0%,100%{transform:translate(-80%,-10%)}50%{transform:translate(60%,-10%)}}
.mis-nao{animation:misNao .4s}@keyframes misNao{20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
g.mis-nao{animation:none}
.mis-anel{transition:stroke-dashoffset .8s linear}
.mis-furo.ok .mis-assobio,.mis-furo.ok .mis-po{display:none}.mis-furo.ok path{stroke:#6fd36f;stroke-width:14}
.mis-assobio{animation:misAss .5s ease-in-out infinite alternate}@keyframes misAss{to{opacity:.2;transform:translateY(-4px)}}
.mis-po{animation:misPo 1s linear infinite}@keyframes misPo{to{transform:translate(50px,-30px);opacity:0}}
.mis-cai{animation:misCai 1.6s linear infinite}@keyframes misCai{to{transform:translateY(470px)}}
.mis-palco.salvo .mis-cai{animation-duration:1.6s;animation-name:misCaiTeto}@keyframes misCaiTeto{80%{opacity:1}to{transform:translateY(300px);opacity:0}}
.mis-ast-i{transform-box:fill-box}
.mis-treme .mis-ast-i,.mis-ast.mis-treme .mis-ast-i{animation:misTreme .12s linear infinite}@keyframes misTreme{50%{transform:translateX(3px)}}
.mis-arrasta{cursor:grab}
.mis-ast.pula .mis-ast-i{animation:misPula .85s cubic-bezier(.3,.7,.4,1)}@keyframes misPula{50%{transform:translateY(var(--h))}}
.mis-fantasma{opacity:.5}.mis-fantasma .mis-ast-i rect,.mis-fantasma .mis-ast-i>circle:first-of-type{fill:#5fa8ff}
.mis-faisca{cursor:grab;filter:drop-shadow(0 0 8px currentColor)}
.mis-sublima{animation:misSub 6s 1.2s forwards}@keyframes misSub{to{opacity:.15;transform:translateY(-6px)}}
.mis-planta{transition:transform 1.2s cubic-bezier(.3,1.6,.5,1)}
.mis-ouro{animation:misOuro 1s ease-in-out infinite alternate;cursor:pointer}@keyframes misOuro{to{stroke:#fff3a0;filter:drop-shadow(0 0 12px #ffd84a)}}
.mis-onda{animation:misOnda .6s linear infinite}@keyframes misOnda{to{stroke-dashoffset:-20}}
.mis-rosto{position:absolute;right:4%;top:6%;width:22%;aspect-ratio:1;border-radius:50%;background:#10202c;border:6px solid #5fc7d9;display:grid;place-items:center;font-size:clamp(48px,9vw,96px);line-height:1}.mis-rosto.feliz{border-color:#ffcf4a;box-shadow:0 0 30px #ffcf4a88}
.mis-painel{position:absolute;inset:6% 16% 6% 6%;border-radius:12px;overflow:hidden;background:#1d3f7a}
.mis-cels{position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 19%,#9fb6c8 19% 20%),repeating-linear-gradient(0deg,transparent 0 32%,#9fb6c8 32% 33.3%)}
.mis-painel canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab}
.mis-bat{position:absolute;right:-12%;top:20%;width:8%;height:60%;border:4px solid #fff;border-radius:8px;display:flex;align-items:flex-end;overflow:hidden}
.mis-bat i{display:block;width:100%;height:0;background:#f2c740;transition:height .3s}
.mis-bts{display:flex;justify-content:center;gap:12px;margin-top:12px}.mis-bts .jg-bt{font-size:22px;padding:10px 22px}
.mis-denovo{display:block;margin:10px auto 0}
.mis-cartas{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:14px}
.mis-carta{flex:1 1 200px;max-width:250px;background:#f4ead2;color:#2a1e00!important;border:3px solid #ffcf4a;border-radius:14px;padding:10px;font-family:inherit;font-weight:700;font-size:15px;line-height:1.3;text-align:left;cursor:pointer}
.mis-carta.sel{outline:4px solid #8ff0ff}.mis-carta.certa{border-color:#6fd36f;background:#dff5df}.mis-carta.errada{border-color:#ff7a5a;background:#fde2dc}.mis-carta small{display:block;font-weight:900;margin-top:4px}
.mis-caixas{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:0 14px 14px}
.mis-caixa{min-height:90px;border:3px dashed rgba(143,240,255,.6);border-radius:14px;background:rgba(143,240,255,.06);color:#fff;font-family:inherit;font-weight:800;font-size:18px;cursor:pointer;padding:8px;display:flex;flex-direction:column;gap:6px;align-items:stretch}
.mis-caixa .mis-carta{max-width:none;font-size:13px}
.mis-envio{display:flex;align-items:center;justify-content:center;gap:16px;font-size:56px;padding:18px 0}.mis-envio i{flex:0 1 200px;height:6px;background:repeating-linear-gradient(90deg,#fff 0 14px,transparent 14px 26px);animation:misOnda2 1s linear infinite}
@keyframes misOnda2{to{background-position:26px 0}}
/* figurinhas */
.mis-ganhou{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;padding:6px 0 4px;overflow:hidden}
.mis-nova{margin:0;font-size:26px;font-weight:900;color:#ffcf4a}
.mis-fig{position:relative;width:150px;perspective:900px}.mis-fig.grande{width:min(330px,80vw)}
.mis-fig-in{position:relative;transition:transform .6s;transform-style:preserve-3d}
.mis-fig.virada .mis-fig-in{transform:rotateY(180deg)}
.mis-fig-frente,.mis-fig-verso{border-radius:16px;border:5px solid #ffcf4a;background:#1b2530;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.mis-fig-frente b{display:block;padding:8px 10px;text-align:center;background:#ffcf4a;color:#2a1e00;font-size:13px;line-height:1.2}
.mis-fig.grande .mis-fig-frente b{font-size:22px;padding:12px}
.mis-fig-f{aspect-ratio:4/3;background-size:cover;background-position:center}
.mis-fig-ico{display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--c) 70%,#fff),var(--c));position:relative}
.mis-fig-ico span{font-size:60px}.mis-fig.grande .mis-fig-ico span{font-size:120px}
.mis-fig-ico small{position:absolute;left:6px;bottom:6px;font-size:10px;font-weight:800;background:rgba(0,0,0,.45);color:#fff;border-radius:999px;padding:2px 8px}
.mis-fig-verso{position:absolute;inset:0;transform:rotateY(180deg);padding:14px 16px;overflow:auto;font-size:14px;line-height:1.4}
.mis-fig.grande .mis-fig-verso{font-size:16px}
.mis-fig-verso h3{margin:0 0 6px;color:#ffcf4a;font-size:1.1em}.mis-fig-verso small{display:block;margin-top:8px;color:#9fb6c8;font-size:12px}
.mis-fig-bts{position:absolute;right:-56px;top:6px;display:flex;flex-direction:column;gap:8px}
@media (max-width:520px){.mis-fig-bts{right:6px;top:6px}}
.mis-fig-bts button{width:46px;height:46px;border-radius:50%;background:#10202c;border:3px solid #ffcf4a;font-size:22px;cursor:pointer;color:#fff}
.mis-radio .mis-fig-frente{border-color:#5fc7d9}.mis-radio .mis-fig-frente b{background:#5fc7d9}
.mis-cred{margin:0;font-size:12px;color:#9fb6c8;text-align:center}
.mis-conf{position:absolute;top:-10px;width:10px;height:16px;border-radius:2px;animation:misConf 1.8s ease-in forwards;pointer-events:none}
@keyframes misConf{to{transform:translateY(420px) rotate(var(--r));opacity:0}}
.mis-alb-h{margin:14px 0 8px;font-size:18px}
.mis-alb{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}
.mis-alb .mis-fig{width:100%}.mis-alb-it{all:unset;cursor:pointer;display:block}.mis-alb-it:focus-visible{outline:3px solid #8ff0ff;border-radius:16px}
.mis-alb-x{aspect-ratio:3/4;border:4px dashed rgba(255,255,255,.3);border-radius:16px;display:grid;place-items:center;font-size:44px;font-weight:900;color:rgba(255,255,255,.35)}
/* no mundo */
.mis-qs{position:absolute;inset:0;pointer-events:none;z-index:2}
.mis-q{position:absolute;left:0;top:0;pointer-events:auto;width:42px;height:42px;border-radius:50%;border:0;background:#ffcf4a;color:#2a1e00;font-family:inherit;font-weight:900;font-size:26px;line-height:1;padding:0;cursor:pointer;box-shadow:0 0 0 8px #ffcf4a44,0 0 0 16px #ffcf4a22;animation:misQ 1.4s ease-in-out infinite}
@keyframes misQ{50%{box-shadow:0 0 0 12px #ffcf4a33,0 0 0 24px #ffcf4a11}}
.mis-clima{position:absolute;inset:0;pointer-events:none;z-index:1}
.mis-chuva{position:absolute;inset:0;overflow:hidden}.mis-chuva i{position:absolute;top:-10px;width:5px;height:16px;border-radius:3px;background:#ffe36a;box-shadow:0 0 8px #ffe36a;animation:misChuva linear infinite}
@keyframes misChuva{to{transform:translateY(110vh)}}
.mis-pill{position:absolute;left:50%;bottom:calc(max(12px,env(safe-area-inset-bottom,0px)) + 64px);transform:translateX(-50%);background:rgba(10,22,32,.94);border:3px solid rgba(143,240,255,.7);border-radius:999px;padding:8px 20px;font-size:24px;font-weight:900;white-space:nowrap}
.mis-abr{border-color:#ff7a5a;animation:misQ 1s infinite}
.mis-cme{position:absolute;right:calc(max(12px,env(safe-area-inset-right,0px)) + 0px);bottom:calc(max(12px,env(safe-area-inset-bottom,0px)) + 160px);width:220px;height:70px;background:rgba(10,20,30,.9);border-radius:16px}
.mis-cme i{position:absolute;top:14px;width:26px;height:26px;border-radius:50%}.mis-cme .sol{left:10px;background:#ffc83a}.mis-cme .mar{right:12px;background:#d9472f;width:20px;height:20px;top:17px}
.mis-cme .nuv{background:#ff8a3a;box-shadow:10px -4px 0 -2px #ffa34a;transition:left 1s}.mis-cme b{position:absolute;left:0;right:0;bottom:6px;text-align:center;font-size:14px}
.jg-rosto.mis-treme{animation:misTreme .12s linear infinite}.jg-rosto.mis-medo{box-shadow:0 0 0 6px #ff7a5a88}
.mis-relo{position:relative;margin:2px 0 6px;display:flex;align-items:center;gap:6px}
.mis-relo .b{position:relative;flex:1;height:8px;border-radius:4px;background:linear-gradient(90deg,#20304a 0%,#f2b640 25%,#f2b640 70%,#20304a 97%)}
.mis-relo em{position:absolute;top:0;bottom:0;right:0;background:#ffd84a;border-radius:0 4px 4px 0}
.mis-relo i{position:absolute;top:-4px;width:3px;height:16px;background:#fff;border-radius:2px}
.mis-relo small{font-size:11px;font-weight:800;color:#ffd84a}.mis-relo.fim em,.mis-relo.fim small{animation:misOuro2 .8s ease-in-out infinite alternate}
@keyframes misOuro2{to{filter:brightness(1.6);text-shadow:0 0 8px #ffd84a}}
@media (prefers-reduced-motion:reduce){.mis-mao,.mis-q,.mis-chuva i,.mis-cai,.jg-rosto.mis-treme,.mis-ast-i{animation:none!important}}
@media (max-width:760px){.mis-pill{left:auto;right:max(12px,env(safe-area-inset-right,0px));transform:none;top:calc(max(12px,env(safe-area-inset-top,0px)) + 248px);bottom:auto;font-size:15px;padding:5px 12px;border-width:2px}}
.mis-dica{position:absolute;pointer-events:none;border:5px solid #ffe9a8;border-radius:22px;box-shadow:0 0 0 4px rgba(255,211,107,.25),0 0 24px rgba(255,211,107,.55);animation:misDica 1.2s ease-in-out infinite;z-index:3}@keyframes misDica{50%{opacity:.45;transform:scale(1.015)}}
.mis-dado{background:#0f2230;border:2px solid rgba(143,240,255,.5);border-radius:16px;padding:16px 18px;max-width:560px;margin:8px auto;text-align:left}.mis-dado b{display:block;font-size:20px;margin-bottom:8px;color:#ffd36b}.mis-dado p{margin:0 0 10px;line-height:1.5}.mis-dado small{opacity:.7}
`;const st=document.createElement("style");st.id="mis-css";st.textContent=css;document.head.appendChild(st)})();