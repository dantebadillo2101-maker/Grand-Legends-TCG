// Grand Legends TCG - IA táctica
window.GLTCG = window.GLTCG || {};

const AI_DIFFICULTIES = {
  baja: { label:'Baja', think:0.65, maxPlays:3, maxAttacks:3, attachDon:1, randomness:0.45, aggression:0.45 },
  normal: { label:'Normal', think:0.45, maxPlays:6, maxAttacks:8, attachDon:2, randomness:0.18, aggression:0.72 },
  dificil: { label:'Difícil', think:0.25, maxPlays:12, maxAttacks:12, attachDon:4, randomness:0.04, aggression:0.95 }
};
let aiDifficulty=localStorage.getItem('GLTCG_AI_DIFFICULTY')||'normal';
if(!AI_DIFFICULTIES[aiDifficulty]) aiDifficulty='normal';
function setAIDifficulty(v){ if(!AI_DIFFICULTIES[v])return; aiDifficulty=v; localStorage.setItem('GLTCG_AI_DIFFICULTY',v); const s=document.getElementById('aiDifficulty'); if(s)s.value=v; }
window.addEventListener('DOMContentLoaded',()=>{const s=document.getElementById('aiDifficulty');if(s)s.value=aiDifficulty;});
function getAIDifficultyConfig(){return AI_DIFFICULTIES[aiDifficulty]||AI_DIFFICULTIES.normal;}

function cardTypeScore(card,config){
  let score=0, p=Number(card.power||0), cost=Number(card.cost||0);
  if(card.type==='Personaje') score += 2400 + p + cost*180;
  if(card.type==='Evento') score += 1700 + cost*120;
  if(card.type==='Recurso') score -= 2600;
  if(card.blocker) score += (p1Field.length>=2?1200:500);
  if(card.onPlay) score += 500;
  if(card.active) score += 450;
  if(card.effect==='ko1500' && p1Field.some(c=>totalPower(c)<=1500)) score+=3000;
  if(card.effect==='bounce1000' && p1Field.some(c=>totalPower(c)<=1000)) score+=2500;
  if(card.effect==='break2') score+=(p1shield>0?3000:500);
  if(card.effect==='stormCollision' && p1Field.length>=2) score+=3200;
  if(card.effect==='koCollision' && p1Field.length) score+=2800;
  if(card.effect==='debuff700' && p1Field.length) score+=1800;
  if(card.effect==='draw2'||card.effect==='draw3'||card.effect==='draw3Discard') score+=900;
  if(card.id && (card.id.startsWith('E')||card.id.startsWith('R')||card.id.startsWith('T'))) score+=250;
  return score;
}
function scoreAICard(card,config){return cardTypeScore(card,config)+(Math.random()<config.randomness?Math.random()*3500:0);}
function chooseAICard(cards,config){if(!cards.length)return null; return cards.slice().sort((a,b)=>scoreAICard(b,config)-scoreAICard(a,config))[0];}

function chooseAITarget(attacker,config){
  if(!p1Field.length)return -1;
  const ap=totalPower(attacker);
  const targets=p1Field.map((card,index)=>{
    const tp=totalPower(card);
    let score=0;
    if(ap>tp) score+=5000+(tp*1.5);
    else if(ap===tp) score+=2800;
    else score-=2200;
    if(card.blocker) score+=2200;
    if(card.power>=2000) score+=900;
    score+=Math.max(0,1000-tp);
    if(config.aggression>0.8 && ap>tp) score+=1800;
    return {index,score};
  });
  targets.sort((a,b)=>b.score-a.score);
  if(Math.random()<config.randomness && targets.length>1)return targets[Math.floor(Math.random()*Math.min(3,targets.length))].index;
  return targets[0].index;
}
function chooseAIEvolutionCard(cards,config){return chooseAICard(cards,config);}
function attachAIDon(config){
  if(!p2DonReserve.length||!p2Field.length)return;
  const candidates=p2Field.filter(u=>!u.hasAttacked||config.aggression>0.8).sort((a,b)=>totalPower(b)-totalPower(a));
  const target=candidates[0]; if(!target)return;
  const amount=Math.min(config.attachDon,p2DonReserve.length);
  p2DonReserve.splice(0,amount); p2don=p2DonReserve.length; target.attached=(target.attached||0)+amount;
  battleStats.donAttached += amount;
  log('🤖 IA: adjuntó '+amount+' DON a '+target.name+'.');
}
GLTCG.ai={difficulties:AI_DIFFICULTIES,getDifficulty:getAIDifficultyConfig,chooseCard:chooseAICard,chooseTarget:chooseAITarget,chooseEvolutionCard:chooseAIEvolutionCard,attachDon:attachAIDon};
