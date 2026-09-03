
"use strict";
window.addEventListener("error",function(ev){
 const box=document.getElementById("jsError");
 if(box){box.style.display="block";box.textContent="⚠️ Error del juego: "+ev.message;}
});

const LIBRARY = GLTCG.CARD_LIBRARY;
const LEADERS = GLTCG.LEADERS;
let selectedLeader = LEADERS[0];
let aiLeader = LEADERS[1]||LEADERS[0];
let leaderAbilityUsed=false;
let deck=[],hand=[],aiHand=[],p1Field=[],p2Field=[],p1Grave=[],p2Grave=[],p1DonDeck=[],p2DonDeck=[],p1DonReserve=[],p2DonReserve=[];
let p1hp=5,p2hp=5,p1shield=3,p2shield=3,p1max=3,p2max=2,p1don=3,p2don=2,p1leaderDon=0,p2leaderDon=0;
let active=1,turn=1,gameOver=false,aiBusy=false,boost=0,customDeck=[];
let localMode="ai"; let p2AttackSelection=null; let combo=0; let comboBonus=0;

function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function cloneCard(c){return {...c,rarity:c.rarity||"Común"}}
const COLLECTION_KEY="gltcg_collection_v21";
const PACK_KEY="gltcg_pack_openings_v22";
let collection=JSON.parse(localStorage.getItem(COLLECTION_KEY)||"{}");
let packOpenings = Math.max(10, Number(Number(localStorage.getItem(PACK_KEY)||0)) || 0);
function saveCollection(){
 localStorage.setItem(COLLECTION_KEY,JSON.stringify(collection));
 const cc=document.getElementById("collectionCount"),pc=document.getElementById("packCount");
 if(cc)cc.textContent=Object.values(collection).reduce((a,b)=>a+b,0);
 if(pc)pc.textContent=packOpenings; syncAccountProgress();saveCurrentProgress();
}
function rarityClass(r){return r==="Ultra Rara"?"ultra":r==="Súper Rara"?"super":r==="Rara"?"rare":""}
function rarityWeight(){let x=Math.random();return x<.05?"Ultra Rara":x<.15?"Súper Rara":x<.40?"Rara":"Común"}
function boosterCard(){
 let wanted=rarityWeight(),pool=LIBRARY.filter(c=>(c.rarity||"Común")===wanted);
 if(!pool.length)pool=LIBRARY;
 return cloneCard(pool[Math.floor(Math.random()*pool.length)])
}
function showGame(){
 const a=document.getElementById("gameApp"),h=document.getElementById("gameHeader");
 if(a)a.style.display="block";if(h)h.style.display="block";
}
function hideGame(){
 const a=document.getElementById("gameApp"),h=document.getElementById("gameHeader");
 if(a)a.style.display="none";if(h)h.style.display="none";
}
function openMainMenu(){
 saveCollection();
 const m=document.getElementById("mainMenu");if(m)m.classList.add("open");
}
function closeMainMenu(){const m=document.getElementById("mainMenu");if(m)m.classList.remove("open")}
function openLocalMode(){closeMainMenu();document.getElementById("localModeModal")?.classList.add("open")}
function closeLocalMode(){document.getElementById("localModeModal")?.classList.remove("open")}
function startLocalAI(){localMode="ai";closeLocalMode();openLeaderForLocal()}
function startLocalPVP(){localMode="pvp";closeLocalMode();openLeaderForLocal()}
function openLeaderForLocal(){
 const lm=document.getElementById("leaderModal");
 if(lm){renderLeaderChoices();lm.classList.add("open")}else{showGame();reset()}
}
function startGame(){startLocalAI()}
function renderLeaderChoices(){
 const box=document.getElementById('leaderChoices');if(!box)return;box.innerHTML='';
 LEADERS.forEach(l=>{
  const e=document.createElement('div');e.className='leader-choice';
  e.innerHTML=`<div class="leader-choice-art">${l.art}</div><h2>${l.name}</h2><div class="badge">${l.color}</div><p>❤️ ${l.life} vidas</p><p>${l.ability}</p><button type="button">👑 Elegir líder</button>`;
  e.querySelector('button').onclick=()=>selectLeader(l.id);box.appendChild(e);
 });
}
function selectLeader(id){
 const found=LEADERS.find(l=>l.id===id)||LEADERS[0];selectedLeader=found;
 aiLeader=LEADERS.filter(l=>l.id!==found.id)[Math.floor(Math.random()*Math.max(1,LEADERS.filter(l=>l.id!==found.id).length))]||LEADERS[0];
 localStorage.setItem('GLTCG_SELECTED_LEADER',selectedLeader.id);
 document.getElementById('leaderModal')?.classList.remove('open');showGame();reset();
}
function openDeckBuilderFromMenu(){
 closeMainMenu();
 showGame();
 openDeckBuilder();
}
function openPack(){
 saveCollection();
 if(document.getElementById("packResult"))document.getElementById("packResult").innerHTML="";
 document.getElementById("packModal").classList.add("open");
 updatePackButton();
}
function closePack(){document.getElementById("packModal").classList.remove("open")}
function updatePackButton(){
 const b=document.getElementById("openPackBtn");
 b.textContent=packOpenings>0?"✨ ABRIR SOBRE":"🔒 SIN APERTURAS";
 b.disabled=packOpenings<=0;
}
function openBooster(){
 if(packOpenings<=0){
   log("🔒 No tienes aperturas de sobres disponibles. Gana una partida para conseguir 10.");
   updatePackButton();
   return;
 }
 packOpenings--;
 let cards=Array.from({length:5},boosterCard),box=document.getElementById("packResult");
 box.innerHTML="";
 cards.forEach(c=>{
   collection[c.name]=(collection[c.name]||0)+1;
   let e=document.createElement("div");
   e.className="card packcard "+rarityClass(c.rarity);
   e.innerHTML="<div class='art'>"+c.art+"</div><h3>"+c.name+"</h3><div>⚡ "+c.cost+" · 💥 "+c.power+"</div><div class='rarity'>✨ "+c.rarity+"</div><div class='ability'>"+c.ability+"</div>";
   box.appendChild(e)
 });
 saveCollection();
 updatePackButton();
 log("🎁 Abriste 1 sobre. Te quedan "+packOpenings+" aperturas.");
}
function makeDeck(){let d=[];let source=customDeck.length?customDeck:LIBRARY;for(let c of source){for(let i=0;i<4;i++)d.push(cloneCard(c))}while(d.length<40)d.push(cloneCard(LIBRARY[d.length%LIBRARY.length]));return shuffle(d.slice(0,40))}
function makeDonDeck(){return shuffle(Array.from({length:20},(_,i)=>({id:i+1,name:"DON!",type:"DON"})))}
function log(t){let x=document.getElementById("log");if(x)x.innerHTML="<div>• "+t+"</div>"+x.innerHTML;arenaLog(t)}
function delay(ms){return new Promise(r=>setTimeout(r,ms))}
function canPlay(){return !gameOver&&!aiBusy&&(localMode==="pvp"||active===1)}
function drawP1(){if(deck.length)hand.push(deck.pop())}
function drawP2(){if(deck.length)aiHand.push(deck.pop())}
function drawDon(p){if(p===1&&p1DonDeck.length&&p1DonReserve.length<p1max){p1DonReserve.push(p1DonDeck.pop());return true}if(p===2&&p2DonDeck.length&&p2DonReserve.length<p2max){p2DonReserve.push(p2DonDeck.pop());return true}return false}
function payP1(n){if(p1DonReserve.length<n)return false;for(let i=0;i<n;i++)p1DonReserve.pop();p1don=p1DonReserve.length;return true}
function totalPower(c){return c.power+(c.attached||0)*500+(c.tempBoost||0)}

function makeDonToken(i){
 const d=document.createElement("div");d.className="doncard";d.textContent="🪙";d.draggable=true;d.title="Arrastra este DON";
 d.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",String(i));e.dataTransfer.effectAllowed="move";d.classList.add("dragging")});
 d.addEventListener("dragend",()=>d.classList.remove("dragging"));return d
}
function setupDropZone(el,kind,index){
 if(!el||el.dataset.donDropReady) return;
 el.dataset.donDropReady="1";
 el.addEventListener("dragover",e=>{if(canPlay()&&p1DonReserve.length){e.preventDefault();e.dataTransfer.dropEffect="move";el.classList.add("dragover")}});
 el.addEventListener("dragleave",()=>el.classList.remove("dragover"));
 el.addEventListener("drop",e=>{e.preventDefault();el.classList.remove("dragover");if(!canPlay()||!p1DonReserve.length)return;let i=Number(e.dataTransfer.getData("text/plain"));if(!p1DonReserve[i])return;p1DonReserve.splice(i,1);p1don=p1DonReserve.length;if(kind==="leader"){p1leaderDon++;log("🪙 DON adjuntado al Líder: +500 poder.")}else{p1Field[index].attached=(p1Field[index].attached||0)+1;log("🪙 DON adjuntado a "+p1Field[index].name+": +500 poder.")}render()})
}

function arenaLog(t){const x=document.getElementById("arenaLog");if(x){const d=document.createElement("div");d.textContent="• "+t;x.prepend(d)}}
function setAIRealtime(t){const x=document.getElementById("aiRealtime");if(x)x.innerHTML='<span class="ai-thinking">🤖 '+t+'</span>'}
function clearAIRealtime(){const x=document.getElementById("aiRealtime");if(x)x.innerHTML=""}
function flashAttack(){const a=document.getElementById("battleArena");if(!a)return;const l=document.createElement("div");l.style.cssText="position:absolute;left:25%;right:25%;top:50%;height:4px;background:#ffd65d;box-shadow:0 0 16px #ffd65d;z-index:5";a.appendChild(l);setTimeout(()=>l.remove(),500)}
let attackSelection=null;
function clearTargets(){document.querySelectorAll(".targetable").forEach(e=>e.classList.remove("targetable"))}
function chooseArenaAttack(i){if(!canPlay()||!p1Field[i])return;attackSelection=i;clearTargets();document.getElementById("arenaP2Leader").classList.add("targetable");p2Field.forEach((_,j)=>{const e=document.querySelector('#arenaP2Field .arena-unit[data-index="'+j+'"]');if(e)e.classList.add("targetable")});arenaLog("🎯 Elige el objetivo de "+p1Field[i].name+".")}
function selectLeaderTarget(p){
 if(localMode==="pvp" && p===1 && p2AttackSelection!==null){clearTargets();flashAttack();attackLeaderP2();p2AttackSelection=null;return}
 if(p!==2||attackSelection===null||!canPlay())return;clearTargets();flashAttack();attackLeader();attackSelection=null
}
function chooseArenaCharacter(j){
 if(localMode==="pvp" && active===2 && p2AttackSelection!==null){const i=p2AttackSelection;clearTargets();flashAttack();attackCharacterP2(i,j);p2AttackSelection=null;return}
 if(attackSelection===null||!canPlay())return;const i=attackSelection;clearTargets();flashAttack();attackCharacter(i,j);attackSelection=null
}
function renderArena(){
 const vals={p1hpArena:p1hp,p2hpArena:p2hp,p1shieldArena:p1shield,p2shieldArena:p2shield,p1donArena:p1DonReserve.length,p2donArena:p2DonReserve.length,arenaP1Power:5000+p1leaderDon*500};
 for(const [id,v] of Object.entries(vals)){const e=document.getElementById(id);if(e)e.textContent=v}
 const t=document.getElementById("arenaTurn");if(t)t.textContent=gameOver?"🏁 PARTIDA TERMINADA":localMode==="pvp"?(active===1?"⚔️ TURNO DE PLAYER 1":"⚔️ TURNO DE PLAYER 2"):(active===1?"⚔️ TU TURNO":"🤖 TURNO DE LA IA");
 const s=document.getElementById("arenaP2Status");if(s)s.textContent=aiBusy?"🤖 Actuando...":"Esperando";
 const arenaLeader=document.getElementById("arenaP1Leader");if(arenaLeader)setupDropZone(arenaLeader,"leader",0);
 const p1=document.getElementById("arenaP1Field"),p2=document.getElementById("arenaP2Field");
 if(p1){p1.innerHTML="";p1Field.forEach((c,i)=>{const e=document.createElement("div");e.className="arena-unit";e.dataset.index=i;e.innerHTML='<div class="arena-art">'+c.art+'</div><h4>'+c.name+'</h4><div class="arena-power">💥 '+totalPower(c)+'</div><div class="arena-dons">🪙 '+(c.attached||0)+' DON</div>';e.onclick=()=>attackSelection!==null?chooseArenaCharacter(i):null;setupDropZone(e,"unit",i);const b=document.createElement("button");b.textContent="⚔️";b.onclick=ev=>{ev.stopPropagation();chooseArenaAttack(i)};if((localMode==="pvp"&&active===1)||localMode==="ai")e.appendChild(b);p1.appendChild(e)})}
 if(p2){p2.innerHTML="";p2Field.forEach((c,i)=>{const e=document.createElement("div");e.className="arena-unit enemy";e.dataset.index=i;e.innerHTML='<div class="arena-art">'+c.art+'</div><h4>'+c.name+'</h4><div class="arena-power">💥 '+totalPower(c)+'</div><div class="arena-dons">🪙 '+(c.attached||0)+' DON'+(c.blocker?" · 🛡️":"")+'</div>';e.onclick=()=>{if(localMode==="pvp"&&p2AttackSelection!==null)chooseArenaCharacter(i);else if(attackSelection!==null)chooseArenaCharacter(i)};if(localMode==="pvp"&&active===2){const b=document.createElement("button");b.textContent="⚔️";b.onclick=ev=>{ev.stopPropagation();chooseArenaAttackP2(i)};e.appendChild(b)}p2.appendChild(e)})}
 const h=document.getElementById("arenaHand");if(h){h.innerHTML="";const source=(localMode==="pvp"&&active===2)?aiHand:hand;const who=(localMode==="pvp"&&active===2)?"PLAYER 2":"PLAYER 1";const lab=document.getElementById("activeHandLabel");if(lab)lab.textContent=gameOver?"":("🃏 Mano de "+who);source.forEach((c,i)=>{const e=document.createElement("div");e.className="card";e.innerHTML='<div class="art">'+c.art+'</div><h3>'+c.name+'</h3><div>⚡ '+c.cost+' · 💥 '+c.power+'</div><button type="button">🃏 JUGAR</button>';e.querySelector("button").onclick=(ev)=>{ev.stopPropagation();localMode==="pvp"&&active===2?playCardP2(i):playCard(i)};h.appendChild(e)})}
}


function setHTML(id,value){const e=document.getElementById(id);if(e)e.innerHTML=value}
function appendHTML(id,value){const e=document.getElementById(id);if(e)e.innerHTML=value+e.innerHTML}

function setText(id,value){const e=document.getElementById(id);if(e)e.textContent=value}



const PROGRESS_KEY="GLTCG_PROGRESS_V1";

function getProgressStore(){
  try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||"{}")}catch(e){return {}}
}
function saveProgressStore(x){localStorage.setItem(PROGRESS_KEY,JSON.stringify(x))}
function captureProgress(){
  return {
    collection: (typeof collection!=="undefined"?collection:{}),
    packOpenings: Math.max(10,Number(typeof packOpenings!=="undefined"?packOpenings:10)||10),
    customDeck: (typeof customDeck!=="undefined"?customDeck:[]),
    wins: 0, losses: 0, level: 1,
    savedAt: Date.now()
  };
}
function saveCurrentProgress(){
  const k=currentUser(); if(!k)return;
  const a=getAccounts(),u=a[k]; if(!u)return;
  const old=getProgressStore()[k]||{};
  const now=captureProgress();
  now.wins=Number(old.wins||u.wins||0);
  now.losses=Number(old.losses||u.losses||0);
  now.level=Number(old.level||u.level||1);
  const store=getProgressStore();store[k]=now;saveProgressStore(store);
  u.collection=now.collection;u.packOpenings=now.packOpenings;u.wins=now.wins;u.losses=now.losses;u.level=now.level;
  a[k]=u;saveAccounts(a);
}
function loadCurrentProgress(){
  const k=currentUser();if(!k)return;
  const a=getAccounts(),u=a[k];if(!u)return;
  const store=getProgressStore(),p=store[k]||{};
  collection=p.collection||u.collection||{};
  packOpenings=Math.max(10,Number(p.packOpenings??u.packOpenings??10)||10);
  if(typeof customDeck!=="undefined" && Array.isArray(p.customDeck))customDeck=p.customDeck;
  store[k]=captureProgress();
  store[k].wins=Number(p.wins??u.wins??0);store[k].losses=Number(p.losses??u.losses??0);store[k].level=Number(p.level??u.level??1);
  saveProgressStore(store);
  a[k]={...u,collection,packOpenings,wins:store[k].wins,losses:store[k].losses,level:store[k].level};
  saveAccounts(a);
}
function manualSave(){
  try{
    saveCurrentProgress();
    const msg=document.getElementById("accountMsg");
    if(msg)msg.textContent="💾 Progreso guardado correctamente.";
  }catch(err){
    const box=document.getElementById("jsError");
    if(box){box.style.display="block";box.textContent="⚠️ Error al guardar: "+err.message;}
    console.error(err);
  }
}
function accountStats(){
  const k=currentUser(),a=getAccounts(),p=getProgressStore()[k];
  const u=a[k];return p||u||{wins:0,losses:0,level:1};
}

const ACCOUNTS_KEY="GLTCG_ACCOUNTS_V1",SESSION_KEY="GLTCG_SESSION_V1";
function getAccounts(){try{return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||"{}")}catch(e){return {}}}
function saveAccounts(a){localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(a))}
function currentUser(){return localStorage.getItem(SESSION_KEY)||""}
function setAccountMsg(t){setText("accountMsg",t)}
function openAccount(){document.getElementById("accountModal")?.classList.add("open");showAccountTab("login");setAccountMsg("")}
function closeAccount(){document.getElementById("accountModal")?.classList.remove("open")}
function showAccountTab(tab){const l=document.getElementById("loginPanel"),r=document.getElementById("registerPanel");if(l)l.style.display=tab==="login"?"block":"none";if(r)r.style.display=tab==="register"?"block":"none";document.getElementById("loginTab")?.classList.toggle("active",tab==="login");document.getElementById("registerTab")?.classList.toggle("active",tab==="register");setAccountMsg("")}
function registerAccount(){const u=(document.getElementById("registerUser")?.value||"").trim(),p=document.getElementById("registerPass")?.value||"",p2=document.getElementById("registerPass2")?.value||"";if(u.length<3)return setAccountMsg("⚠️ El usuario debe tener al menos 3 caracteres.");if(!/^[a-zA-Z0-9_]+$/.test(u))return setAccountMsg("⚠️ Usa solo letras, números y _.");if(p.length<4)return setAccountMsg("⚠️ La contraseña debe tener al menos 4 caracteres.");if(p!==p2)return setAccountMsg("⚠️ Las contraseñas no coinciden.");const a=getAccounts(),k=u.toLowerCase();if(a[k])return setAccountMsg("⚠️ Ese usuario ya existe.");a[k]={username:u,password:p,wins:0,losses:0,level:1,collection:{},packOpenings:10};saveAccounts(a);localStorage.setItem(SESSION_KEY,k);collection=a[k].collection;packOpenings=10;loadCurrentProgress();saveCollection();setAccountMsg("✅ Cuenta creada. ¡Bienvenido, "+u+"!");setTimeout(closeAccount,600)}
function loginAccount(){const u=(document.getElementById("loginUser")?.value||"").trim(),p=document.getElementById("loginPass")?.value||"",a=getAccounts(),k=u.toLowerCase();if(!a[k]||a[k].password!==p)return setAccountMsg("⚠️ Usuario o contraseña incorrectos.");localStorage.setItem(SESSION_KEY,k);collection=a[k].collection||{};packOpenings=Math.max(10,Number(a[k].packOpenings)||10);loadCurrentProgress();saveCollection();setAccountMsg("✅ Sesión iniciada.");setTimeout(closeAccount,500)}
function openProfile(){const k=currentUser(),a=getAccounts(),u=a[k];if(!u){openAccount();return}const c=document.getElementById("profileContent");if(!c)return;c.innerHTML='<div class="profile-card"><div class="account-name">🏴‍☠️ '+u.username+'</div><p>🏆 Victorias: '+u.wins+'</p><p>💀 Derrotas: '+u.losses+'</p><p>⭐ Nivel: '+u.level+'</p><p>📦 Aperturas: '+Math.max(10,Number(u.packOpenings)||10)+'</p></div>';document.getElementById("profileModal")?.classList.add("open")}
function closeProfile(){document.getElementById("profileModal")?.classList.remove("open")}
function logoutAccount(){localStorage.removeItem(SESSION_KEY);closeProfile()}
function syncAccountProgress(){const k=currentUser(),a=getAccounts();if(k&&a[k]){a[k].collection=collection;a[k].packOpenings=Math.max(10,packOpenings);saveAccounts(a)}}



const tutorialSteps=[
 {title:"🏴‍☠️ Bienvenido a Grand Legends TCG",text:"Vamos a aprender lo básico con una partida guiada. No podrás romper el tutorial: cada paso desbloquea la siguiente acción.",tip:"💡 Tu objetivo será aprender Líder, cartas, DON, ataques y defensa."},
 {title:"👑 Tu Líder",text:"El Líder es el corazón de tu estrategia. Desde el tablero puedes ver sus puntos de vida y el DON que tiene asignado.",tip:"👉 Primero familiarízate con la parte inferior del tablero: ahí está tu campo y tu Líder."},
 {title:"🃏 Tu mano",text:"Las cartas de tu mano se encuentran abajo. Para jugar una carta, pulsa JUGAR cuando tengas suficiente coste.",tip:"👉 En el siguiente paso, elige una carta de coste bajo y pulsa 🃏 JUGAR."},
 {title:"🪙 El DON",text:"El DON sirve para pagar costes y también puede adjuntarse para aumentar el poder de tus personajes.",tip:"👉 Después de jugar una carta, podremos practicar el uso del DON."},
 {title:"⚔️ Atacar",text:"Selecciona un personaje de tu campo y luego el objetivo. El juego resaltará los objetivos válidos.",tip:"👉 Busca el botón ⚔️ de tu personaje para comenzar el ataque."},
 {title:"🏆 ¡Tutorial completado!",text:"¡Ya conoces las bases! Ahora puedes enfrentarte a la IA y practicar todo lo aprendido.",tip:"🎁 Como recompensa, recibirás al menos 10 aperturas de sobres de bienvenida."}
];
let tutorialActive=false,tutorialIndex=0,tutorialStartedFromMenu=false;

function openTutorial(){
 tutorialActive=true;tutorialIndex=0;
 const ov=document.getElementById("tutorialOverlay");if(ov)ov.classList.add("open");
 renderTutorialStep();
}
function closeTutorial(){
 tutorialActive=false;
 const ov=document.getElementById("tutorialOverlay");if(ov)ov.classList.remove("open");
 document.querySelectorAll(".tutorial-highlight").forEach(e=>e.classList.remove("tutorial-highlight"));
}
function skipTutorial(){closeTutorial()}
function renderTutorialStep(){
 const s=tutorialSteps[tutorialIndex];
 setText("tutorialStep","TUTORIAL · "+(tutorialIndex+1)+"/"+tutorialSteps.length);
 setText("tutorialTitle",s.title);setText("tutorialText",s.text);setText("tutorialTip",s.tip);
 const b=document.getElementById("tutorialNext");if(b)b.textContent=tutorialIndex===tutorialSteps.length-1?"🚀 Empezar a jugar":"Siguiente ➡️";
 document.querySelectorAll(".tutorial-highlight").forEach(e=>e.classList.remove("tutorial-highlight"));
 if(tutorialIndex===1)document.getElementById("arenaP1Leader")?.classList.add("tutorial-highlight");
 if(tutorialIndex===2)document.getElementById("arenaHand")?.classList.add("tutorial-highlight");
 if(tutorialIndex===3)document.getElementById("p1donZoneArena")?.classList.add("tutorial-highlight");
 if(tutorialIndex===4)document.getElementById("arenaP1Field")?.classList.add("tutorial-highlight");
}
function tutorialNext(){
 if(tutorialIndex<tutorialSteps.length-1){tutorialIndex++;renderTutorialStep();return}
 closeTutorial();
 packOpenings=Math.max(10,Number(packOpenings)||0);
 saveCollection();
 startGame();
}

function render(){
 setText('arenaP1LeaderName',selectedLeader.name);setText('arenaP1LeaderAbility',selectedLeader.ability);setText('arenaP2LeaderName',aiLeader.name);setText('arenaP2LeaderAbility',aiLeader.ability);
 setText('arenaP1LeaderArt',selectedLeader.art);setText('arenaP2LeaderArt',aiLeader.art);
 setText("p1hp",p1hp);setText("p2hp",p2hp);setText("p1hp2",p1hp);setText("p2hp2",p2hp);
 setText("p1shield",p1shield);setText("p2shield",p2shield);
 setText("p1don",p1DonReserve.length);setText("p2don",p2DonReserve.length);
 setText("p1max",p1max);setText("p2max",p2max);
 setText("p1hand",hand.length);setText("p2hand",aiHand.length);const p2t=document.getElementById("p2Title");if(p2t)p2t.textContent=localMode==="pvp"?"👥 PLAYER 2 — LOCAL":"🤖 PLAYER 2 — IA";
 setText("p1grave",p1Grave.length);setText("p2grave",p2Grave.length);
 setText("p1leaderPower",5000+p1leaderDon*500);
 setText('arenaP1Power',5000+p1leaderDon*500);
 setText("turnText",gameOver?"PARTIDA TERMINADA":"TURNO DE "+(active===1?"PLAYER 1":"PLAYER 2"));
 setText("pStatus",localMode==="pvp"?(active===1?"🟢 Turno de PLAYER 1":"🔴 Turno de PLAYER 2"):(active===1?"🟢 Puedes jugar":"🔴 Esperando a la IA"));
 const db=document.getElementById("drawBtn"),eb=document.getElementById("endBtn");
 if(db)db.disabled=!canPlay();if(eb)eb.disabled=!canPlay();
 renderShields("p1shields",p1shield);renderShields("p2shields",p2shield);renderDon();
 renderHand();renderField("p1field",p1Field,false);renderField("p2field",p2Field,true);
 if(typeof renderArena==="function")renderArena();
}
function renderShields(id,n){let b=document.getElementById(id);if(!b)return;b.innerHTML="";for(let i=0;i<n;i++){let s=document.createElement("span");s.className="shield";s.textContent="🛡️";b.appendChild(s)}}
function renderDon(){
 let a=document.getElementById("arenaP1DonPool");if(a){a.innerHTML="";p1DonReserve.forEach((_,i)=>a.appendChild(makeDonToken(i)))}
 let b=document.getElementById("arenaP2DonPool");if(b){b.innerHTML="";p2DonReserve.forEach(()=>{let d=document.createElement("div");d.className="doncard";d.textContent="🪙";b.appendChild(d)})}
 setText("p1donDeckCount",p1DonDeck.length);setText("p2donDeckCount",p2DonDeck.length);
 const l1=document.getElementById("p1leaderTokens"),l2=document.getElementById("p2leaderTokens");
 if(l1){l1.innerHTML="";for(let i=0;i<p1leaderDon;i++){let t=document.createElement("span");t.className="token";t.textContent="🪙";l1.appendChild(t)}}
 if(l2){l2.innerHTML="";for(let i=0;i<p2leaderDon;i++){let t=document.createElement("span");t.className="token";t.textContent="🪙";l2.appendChild(t)}}
 const leader=document.getElementById("arenaP1Leader");if(leader)setupDropZone(leader,"leader",0);
}
function renderHand(){
 let h=document.getElementById("hand");if(!h)return;h.innerHTML="";
 const source=(localMode==="pvp"&&active===2)?aiHand:hand;
 source.forEach((c,i)=>{let e=document.createElement("div");e.className="card";e.innerHTML="<div class='art'>"+c.art+"</div><h3>"+c.name+"</h3><div>⚡ Coste "+c.cost+" · 💥 "+c.power+"</div><div class='badge'>"+c.type+"</div><div class='ability'>"+c.ability+"</div>";e.onclick=()=>localMode==="pvp"&&active===2?playCardP2(i):playCard(i);h.appendChild(e)})
}
function renderField(id,arr,enemy){
 let b=document.getElementById(id);if(!b)return;b.innerHTML="";
 arr.forEach((c,i)=>{let e=document.createElement("div");e.className="unit"+(enemy?" enemy":"");
 e.innerHTML="<div class='art'>"+c.art+"</div><h4>"+c.name+"</h4><div class='power'>💥 "+totalPower(c)+"</div><div class='meta'>⚡ Coste "+c.cost+" · 🪙 "+(c.attached||0)+" DON</div><div class='ability'>"+c.ability+"</div>";
 let tok=document.createElement("div");tok.className="tokens";for(let n=0;n<(c.attached||0);n++){let t=document.createElement("span");t.className="token";t.textContent="🪙";tok.appendChild(t)}e.appendChild(tok);
 if(!enemy&&canPlay()){setupDropZone(e,"unit",i);let ab=document.createElement("button");ab.className="small";ab.textContent="⚔️ Atacar";ab.onclick=()=>chooseAttack(i);e.appendChild(ab);
 if(c.active){let x=document.createElement("button");x.className="small";x.textContent="✨ Habilidad";x.onclick=()=>activateAbility(i);e.appendChild(x)}}
 b.appendChild(e)})
}
function chooseEnemyIndex(maxPower=Infinity){
 if(!p2Field.length)return -1;
 let candidates=p2Field.map((c,i)=>({c,i})).filter(x=>totalPower(x.c)<=maxPower);
 return (candidates.length?candidates:p2Field.map((c,i)=>({c,i}))).sort((a,b)=>totalPower(a.c)-totalPower(b.c))[0]?.i ?? -1;
}
function comboAction(){combo++;return combo;}
function comboHas(n){return combo>=n;}
function addCombo(n){combo=Math.max(0,combo+n);log('⚡ COMBO '+combo+'!');}
function applyCollisionEffect(c){
 const e=c.effect||'';
 if(e==='comboPlus1')addCombo(1); else if(e==='comboPlus2')addCombo(2); else if(e==='comboPlus3')addCombo(3);
 else if(e==='comboDraw'){drawP1();if(comboHas(3)){drawP1();if(hand.length){hand.shift();log('⚡ Combo 3: robaste otra y descartaste 1.')}}}
 else if(e==='comboDraw2Discard'){drawP1();if(comboHas(3)){drawP1();if(hand.length)hand.shift();log('⚡ Combo 3: robaste 2 y descartaste 1.')}}
 else if(e==='comboEvent800'){boost+=500;if(comboHas(2))boost+=300;log('💥 Primer Impacto aplicó su bono de Combo.')}
 else if(e==='comboEventReady'){boost+=1000;if(comboHas(3)&&p1Field.length)p1Field[0].summoningSickness=false}
 else if(e==='comboEvent1500'){boost+=1500;log('💥 Colisión Suprema: +1500 preparado.')}
 else if(e==='comboKO'){let lim=comboHas(5)?2500:1800;let i=chooseEnemyIndex(lim);if(i>=0){p1Grave.push(p2Field.splice(i,1)[0]);log('💥 Cadena Destructiva derrotó a un enemigo.')}}
 else if(e==='comboFinal'){let i=chooseEnemyIndex();if(i>=0){p2Field[i].tempBoost=(p2Field[i].tempBoost||0)-1500;if(comboHas(4)&&totalPower(p2Field[i])<=1500){p1Grave.push(p2Field.splice(i,1)[0]);log('💥 Impacto Final remató al enemigo.')}}}
 else if(e==='stormCombo'){p2Field.forEach(x=>x.tempBoost=(x.tempBoost||0)-700);if(comboHas(5))p2Field.forEach(x=>x.disabledThisTurn=true)}
 else if(e==='legendCombo'){boost+=2000;log('👑 Golpe de la Leyenda: +2000.')}
 else if(e==='boost500'){boost+=500}
 else if(e==='draw3Discard'){drawP1();drawP1();drawP1();if(hand.length)hand.shift()}
 else if(e==='donRecover2'){for(let i=0;i<2&&p1DonDeck.length;i++)p1DonReserve.push(p1DonDeck.pop());p1don=p1DonReserve.length}
 else if(e==='legendResource'){drawP1();drawP1();drawP1();drawP1();for(let i=0;i<2&&p1DonDeck.length;i++)p1DonReserve.push(p1DonDeck.pop());p1don=p1DonReserve.length}
}

function applyCardEffect(c){
 const e=c.effect||c.onPlay;
 if(e==='draw'){drawP1();log('🎴 Robaste 1 carta.');}
 else if(e==='draw2'){drawP1();drawP1();log('🎴 Robaste 2 cartas.');}
 else if(e==='draw3'){drawP1();drawP1();drawP1();log('🎴 Robaste 3 cartas.');}
 else if(e==='drawDiscard'){drawP1();if(hand.length){hand.shift();log('🗑️ Descartaste 1 carta.');}}
 else if(e==='draw2Discard'){drawP1();drawP1();if(hand.length){hand.shift();log('🗺️ Robaste 2 y descartaste 1.');}}
 else if(e==='peek2'){if(deck.length){let a=deck.pop();let b=deck.length?deck.pop():null;hand.push(a);if(b)deck.push(b);log('🔭 Exploraste las primeras cartas y añadiste 1 a tu mano.');}}
 else if(e==='healshield'){if(p1shield<5&&p1shield<=2){p1shield++;log('🛡️ Recuperaste 1 escudo.');}}
 else if(e==='shield'){damageShield(2,1)}
 else if(e==='boost700'){boost+=700;log('✨ Tu próximo personaje gana +700.');}
 else if(e==='charge'){boost+=700;log('🔋 Carga preparada: +700 al próximo personaje.');}
 else if(e==='debuff700'){let i=chooseEnemyIndex();if(i>=0){p2Field[i].tempBoost=(p2Field[i].tempBoost||0)-700;log('⛓️ '+p2Field[i].name+' perdió 700 poder.');}}
 else if(e==='debuff300'){let i=chooseEnemyIndex();if(i>=0){p2Field[i].tempBoost=(p2Field[i].tempBoost||0)-300;log('🏹 Un enemigo perdió 300 poder.');}}
 else if(e==='break2'){damageShield(2,2);}
 else if(e==='recover'){if(p1Grave.length){let c2=p1Grave.pop();hand.push(c2);log('🪽 Recuperaste '+c2.name+' del cementerio.');}}
 else if(e==='ko1500'){let i=chooseEnemyIndex(1500);if(i>=0){p1Grave.push(p2Field.splice(i,1)[0]);log('⚡ Derrotaste a un personaje enemigo.');}}
 else if(e==='bounce1000'){let i=chooseEnemyIndex(1000);if(i>=0){let c2=p2Field.splice(i,1)[0];aiHand.push(c2);log('🌊 '+c2.name+' volvió a la mano enemiga.');}}
 else if(e==='ready'){if(p1Field.length){p1Field[0].summoningSickness=false;log('💨 Un personaje queda listo para atacar.');}}
 else if(e==='prevent'){window._preventLeaderDamage=true;log('🏰 El próximo daño a tu Líder queda prevenido.');}
 else if(e==='team300'){p1Field.forEach(x=>x.tempBoost=(x.tempBoost||0)+300);log('🚩 Todos tus personajes ganan +300.');}
 else if(e==='donRecover'){if(p1DonDeck.length){p1DonReserve.push(p1DonDeck.pop());p1don=p1DonReserve.length;log('🪙 Recuperaste 1 DON a la reserva.');}}
}
function applyOnKO(c){if(c.onKO==='draw2'){drawP1();drawP1();log('💀 Último Aliento: robaste 2 cartas.');}else if(c.onKO==='healshield'){if(p1shield<5){p1shield++;log('💀 Último Aliento: recuperaste 1 escudo.');}}}
function cardPowerBonus(c){let n=0;if(c.onPlay==='beastBonus'&&(c.attached||0)>=2)n+=300;if(c.onPlay==='kingBonus'&&p1Field.length>=2)n+=500;if(c.onPlay==='legendBonus'&&p1shield<=1)n+=700;if(c.onPlay==='legendFieldBonus'&&p1Field.length>=2)n+=600;return n;}
function playCard(i){
 if(!canPlay())return;let c=hand[i];if(!payP1(c.cost)){log('❌ No tienes suficientes DON.');return}
 hand.splice(i,1);comboAction();log('🎴 Jugaste '+c.name+'. ⚡ Combo '+combo);
 if(selectedLeader.id==='L02' && c.type==='Evento' && !leaderAbilityUsed){drawP1();leaderAbilityUsed=true;log('🌌 Lyra: robaste 1 carta por jugar un Evento.');}
 if(c.type==='Evento'||c.type==='Recurso'){applyCardEffect(c);if(c.set==='COLLISION')applyCollisionEffect(c);}
 else{let u=cloneCard(c);u.attached=0;u.tempBoost=boost;u.used=false;u.summoningSickness=true;boost=0;u.basePower=u.power;u.tempBoost=(u.tempBoost||0)+cardPowerBonus(u);p1Field.push(u);applyCardEffect(c);if(c.set==='COLLISION')applyCollisionEffect(c);}
 checkWin();render()
}
function damageShield(player,n){
 if(player===1){let k=Math.min(n,p1shield);p1shield-=k;p1hp=Math.max(0,p1hp-(n-k));log("💥 P2 perdió "+k+" escudo(s).")}
 else{let k=Math.min(n,p2shield);p2shield-=k;p2hp=Math.max(0,p2hp-(n-k));log("💥 P2 perdió "+k+" escudo(s).")}
}
function chooseAttack(i){chooseArenaAttack(i)}
function attackCharacter(i,j){
 let a=p1Field[i],t=p2Field[j];if(!a||!t)return;if(a.summoningSickness){log('⏳ Este personaje acaba de entrar y no puede atacar todavía.');return;}
 if(selectedLeader.id==='L01'&&!leaderAbilityUsed){a.tempBoost=(a.tempBoost||0)+500;leaderAbilityUsed=true;log('🌅 Kael activa su habilidad: +500 poder este combate.');}
  if(selectedLeader.id==='C41'&&comboHas(2)&&!leaderAbilityUsed){a.tempBoost=(a.tempBoost||0)+500;leaderAbilityUsed=true;log('💥 Raze: Combo 2 → +500 este combate.');}
 let ap=totalPower(a),tp=totalPower(t);log("⚔️ "+a.name+" ("+ap+") ataca a "+t.name+" ("+tp+").");
 if(ap>tp){p2Grave.push(p2Field.splice(j,1)[0]);log("💥 "+t.name+" fue KO. "+a.name+" sobrevive.");}
 else if(ap<tp){p1Grave.push(p1Field.splice(i,1)[0]);log("💀 "+a.name+" fue KO. "+t.name+" sobrevive.");}
 else{p2Grave.push(p2Field.splice(j,1)[0]);p1Grave.push(p1Field.splice(i,1)[0]);log("💥 Empate: ambos personajes fueron KO.");}
 checkWin();render()
}
function attackLeader(){
 if(!canPlay())return;
 let blockers=p2Field.filter(c=>c.blocker);
 if(blockers.length){let b=blockers[0];let use=confirm("🛡️ "+b.name+" tiene BLOCKER. ¿Quieres atacar al Líder igualmente? La IA puede bloquear.");if(!use)return}
 p2shield>0?(p2shield--,log("👑 ¡Ataque al Líder! Rompiste 1 🛡️.")):(p2hp=Math.max(0,p2hp-1),log("👑 ¡Ataque al Líder! Perdió 1 ❤️."));
 checkWin();render()
}
function activateAbility(i){
 let c=p1Field[i];if(!c||c.used||!canPlay())return;
 if(c.active==='boostOther'&&payP1(1)){
   let target=p1Field.find((x,ix)=>ix!==i);
   if(target){target.tempBoost=(target.tempBoost||0)+500;c.used=true;log('✨ '+c.name+': otro personaje gana +500 este turno.');}
   else log('❌ Necesitas otro personaje.');
 }else log('❌ No se puede activar ahora.');
 render()
}

function payP2(n){if(p2DonReserve.length<n)return false;for(let i=0;i<n;i++)p2DonReserve.pop();p2don=p2DonReserve.length;return true}
function playCardP2(i){
 if(localMode!=="pvp"||active!==2||gameOver)return;
 let c=aiHand[i];if(!c)return;
 if(!payP2(c.cost)){log("❌ PLAYER 2 no tiene suficientes DON.");return}
 aiHand.splice(i,1);log("🎴 PLAYER 2 jugó "+c.name+".");
 if(c.type==="Evento"||c.type==="Recurso"){
   if(c.effect==="draw")drawP2();
   else if(c.effect==="draw2"){drawP2();drawP2()}
   else if(c.effect==="draw3"){drawP2();drawP2();drawP2()}
   else if(c.effect==="healshield"&&p2shield<5)p2shield++;
   else if(c.effect==="break2")damageShield(2,2);
   else if(c.effect==="ko1500"&&p1Field.length)p2Grave.push(p1Field.shift());
   else if(c.effect==="bounce1000"&&p1Field.length){
      let ix=p1Field.findIndex(x=>totalPower(x)<=1000);
      if(ix>=0)aiHand.push(p1Field.splice(ix,1)[0]);
   } else if(c.effect==="debuff700"&&p1Field.length)p1Field[0].tempBoost=(p1Field[0].tempBoost||0)-700;
   else if(c.effect==="debuff300"&&p1Field.length)p1Field[0].tempBoost=(p1Field[0].tempBoost||0)-300;
   else if(c.effect==="recover"&&p2Grave.length)aiHand.push(p2Grave.pop());
   else if(c.effect==="ready"&&p2Field.length)p2Field[0].summoningSickness=false;
 } else {
   let u=cloneCard(c);u.attached=0;u.tempBoost=0;u.used=false;u.summoningSickness=true;u.basePower=u.power;p2Field.push(u);
 }
 checkWin();render()
}
function chooseArenaAttackP2(i){
 if(localMode!=="pvp"||active!==2||!p2Field[i])return;
 p2AttackSelection=i;clearTargets();
 document.getElementById("arenaP1Leader")?.classList.add("targetable");
 p1Field.forEach((_,j)=>document.querySelector('#arenaP1Field .arena-unit[data-index="'+j+'"]')?.classList.add("targetable"));
 arenaLog("🎯 PLAYER 2 elige objetivo de "+p2Field[i].name+".")
}
function attackCharacterP2(i,j){
 let a=p2Field[i],t=p1Field[j];if(!a||!t||a.summoningSickness)return;
 let ap=totalPower(a),tp=totalPower(t);log("⚔️ PLAYER 2: "+a.name+" ("+ap+") ataca a "+t.name+" ("+tp+").");
 if(ap>tp){p1Grave.push(p1Field.splice(j,1)[0]);log("💥 "+t.name+" fue KO.")}
 else if(ap<tp){p2Grave.push(p2Field.splice(i,1)[0]);log("💥 "+a.name+" fue KO.")}
 else{p1Grave.push(p1Field.splice(j,1)[0]);p2Grave.push(a);log("💥 Empate: ambos personajes fueron KO.")}
 checkWin();render()
}
function attackLeaderP2(){
 if(localMode!=="pvp"||active!==2||gameOver)return;
 if(p1shield>0){p1shield--;log("👑 PLAYER 2 atacó al Líder y rompió 1 🛡️.")}
 else{p1hp=Math.max(0,p1hp-1);log("👑 PLAYER 2 dañó al Líder por 1 ❤️.")}
 checkWin();render()
}

function checkWin(){
 if(gameOver)return;
 if(p1hp<=0){
   gameOver=true;
   log("💀 PLAYER 1 perdió.");
   if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="🏆 P2 ganó.";
   render();
 }
 if(p2hp<=0){
   gameOver=true;
   packOpenings+=10;
   localStorage.setItem(PACK_KEY,String(packOpenings));
   log("🏆 ¡PLAYER 1 GANÓ! +10 aperturas de sobres 🎁");
   if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="💀 P2 perdió.";
   saveCollection();
   render();
 }
}
async function aiTurn(){ if(localMode==="pvp")return;
 aiBusy=true;if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="🟡 Robando carta...";setAIRealtime("Robando carta...");arenaLog("🤖 P2 roba una carta.");render();await delay(1000);drawP2();drawDon(2);p2don=p2DonReserve.length;p2max=Math.min(10,p2max+1);
 if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="🟡 Analizando...";setAIRealtime("Pensando su jugada...");render();await delay(1300);
 let choices=aiHand.filter(c=>c.cost<=p2DonReserve.length).sort((a,b)=>(b.power||0)-(a.power||0));
 if(choices.length){let c=choices[0],idx=aiHand.indexOf(c);for(let k=0;k<c.cost;k++)p2DonReserve.pop();p2don=p2DonReserve.length;aiHand.splice(idx,1);if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="🟠 Jugando "+c.name+"...";setAIRealtime("Jugando "+c.name+"...");arenaLog("🃏 P2 juega "+c.name+".");render();await delay(1200);
  if(c.type==="Personaje"){let u=cloneCard(c);u.attached=0;u.tempBoost=0;u.summoningSickness=true;p2Field.push(u);if(c.onPlay==="healshield"&&p2shield<5)p2shield++;if(c.onPlay==="shield"&&p1shield)p1shield--;log("🤖 P2 invocó "+c.name+".")}
  else if(c.type==="Evento"){if(c.effect==="break2")damageShield(1,2);else if(c.effect==="ko1500"&&p1Field.length){p2Grave.push(p1Field.shift());log("🤖 P2 derrotó un personaje.")}else if(c.effect==="bounce1000"&&p1Field.length){let x=p1Field.findIndex(x=>totalPower(x)<=1000);if(x>=0)aiHand.push(p1Field.splice(x,1)[0]);}else p1hp=Math.max(0,p1hp-1);log("🤖 P2 usó "+c.name+".")}
  else{log("🤖 P2 usó "+c.name+".")}
  render();await delay(700)}
 if(p2Field.length&&!gameOver){if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="🔴 Atacando...";setAIRealtime("Decidiendo un ataque...");render();await delay(1200);let a=p2Field[0],power=totalPower(a);
  if(p1Field.length){let t=p1Field[0];if(power>totalPower(t)){p1Grave.push(p1Field.shift());log("🤖 "+a.name+" derrotó a "+t.name+". "+a.name+" sobrevive.")}else if(power<totalPower(t)){p2Grave.push(p2Field.shift());log("🤖 "+a.name+" fue derrotado. "+t.name+" sobrevive.")}else{p1Grave.push(p1Field.shift());p2Grave.push(a);log("🤖 Empate: ambos personajes fueron KO.")}}
  else if(p1leaderDon>=0){if(p1shield>0){p1shield--;log("🤖 P2 atacó y rompió 1 🛡️.")}else{p1hp=Math.max(0,p1hp-1);log("🤖 P2 dañó al Líder por 1 ❤️.")}}
 }
 checkWin();if(!gameOver){active=1;turn++;p1max=Math.min(10,p1max+1);drawP1();drawDon(1);p1don=p1DonReserve.length;if(document.getElementById("aiStatus"))document.getElementById("aiStatus").textContent="🟢 Esperando";log("🔄 Tu turno: robaste 1 carta y 1 DON.")}aiBusy=false;render()
}
function endTurn(){
 if(gameOver)return;
 if(localMode==="pvp"){
   if(active===1){active=2;log("🔄 Turno de PLAYER 2.");drawP2();drawDon(2);p2don=p2DonReserve.length;p2max=Math.min(10,p2max+1);}
   else{active=1;log("🔄 Turno de PLAYER 1.");drawP1();drawDon(1);p1don=p1DonReserve.length;p1max=Math.min(10,p1max+1);}
   p1Field.forEach(c=>c.summoningSickness=false);p2Field.forEach(c=>c.summoningSickness=false);
   render(); return;
 }
 if(active!==1||aiBusy)return;
 active=2;log("⏭️ Terminaste tu turno.");render();aiTurn()
}
function reset(){
 const saved=localStorage.getItem('GLTCG_SELECTED_LEADER');if(saved){const found=LEADERS.find(l=>l.id===saved);if(found)selectedLeader=found;}
 leaderAbilityUsed=false;
 deck=makeDeck();hand=[];aiHand=[];p1Field=[];p2Field=[];p1Grave=[];p2Grave=[];p1DonDeck=makeDonDeck();p2DonDeck=makeDonDeck();p1DonReserve=[];p2DonReserve=[];
 p1hp=5;p2hp=5;p1shield=3;p2shield=3;p1max=3;p2max=2;p1don=0;p2don=0;p1leaderDon=0;p2leaderDon=0;active=1;turn=1;gameOver=false;aiBusy=false;boost=0;leaderAbilityUsed=false;combo=0;comboBonus=0;
 for(let i=0;i<5;i++){drawP1();drawP2()}for(let i=0;i<3;i++){drawDon(1);drawDon(2)}if(document.getElementById("log"))document.getElementById("log").innerHTML="";log("🏴‍☠️ ¡Nueva partida!");render()
}
function openDeckBuilder(){const m=document.getElementById("deckModal");if(m)m.classList.add("open");renderDeckBuilder()}
function closeDeckBuilder(){const m=document.getElementById("deckModal");if(m)m.classList.remove("open")}
function renderDeckBuilder(){
 let search=document.getElementById("search"),g=document.getElementById("deckGrid");if(!g)return;let q=(search?search.value:"").toLowerCase();g.innerHTML="";const dc=document.getElementById("deckCount");if(dc)dc.textContent=customDeck.length;
 LIBRARY.filter(c=>(set==='ALL'||c.set===set)&&c.name.toLowerCase().includes(q)).forEach(c=>{let count=customDeck.filter(x=>x.name===c.name).length;let e=document.createElement("div");e.className="deckitem";e.innerHTML="<div style='font-size:40px'>"+c.art+"</div><b>"+c.name+"</b><br>⚡ "+c.cost+" · 💥 "+c.power+"<br><small>⭐ "+(c.rarity||'Común')+"</small><br><small>"+count+"/4 copias</small><br><button class='small' "+(count>=4?"disabled":"")+">＋ Añadir</button> <button class='small' "+(count<=0?"disabled":"")+">－ Quitar</button>";e.querySelectorAll("button")[0].onclick=()=>{customDeck.push(cloneCard(c));renderDeckBuilder()};e.querySelectorAll("button")[1].onclick=()=>{let ix=customDeck.findIndex(x=>x.name===c.name);if(ix>=0)customDeck.splice(ix,1);renderDeckBuilder()};g.appendChild(e)})
}
function openSets(){const m=document.getElementById('setsModal');const b=document.getElementById('setsList');if(!m||!b)return;b.innerHTML='';(GLTCG.SETS||[]).forEach(s=>{const e=document.createElement('div');e.className='deckitem';e.innerHTML='<div style=\"font-size:42px\">'+(s.id==='COLLISION'?'💥':s.id==='SHADOWS'?'🌑':s.id==='AWAKENING'?'🌟':'🌅')+'</div><h3>'+s.name+'</h3><p>🎴 '+s.cards.length+' cartas · 👑 '+s.leaders.length+' líderes</p><small>'+s.leaders.map(x=>x.name).join(' · ')+'</small>';b.appendChild(e)});m.classList.add('open')}
function closeSets(){document.getElementById('setsModal')?.classList.remove('open')}
document.getElementById("drawBtn").onclick=()=>{if(gameOver)return;if(localMode==="pvp"&&active===2){drawP2();log("🎴 PLAYER 2 robó 1 carta.");render()}else if(canPlay()){drawP1();log("🎴 Robaste 1 carta.");render()}}
document.getElementById("endBtn").onclick=endTurn;document.getElementById("resetBtn").onclick=reset;document.getElementById("deckBtn").onclick=openDeckBuilder;
saveCollection();
hideGame();
