"use strict";

window.addEventListener("error", function(ev) {
  const box = document.getElementById("jsError");
  if (box) {
    box.style.display = "block";
    box.textContent = "⚠️ Error del juego: " + ev.message;
  }
});

/* ==========================================================================
   ESTADO GLOBAL DEL JUEGO Y BIBLIOTECA
   ========================================================================== */
const LIBRARY = GLTCG.CARD_LIBRARY;
const LEADERS = GLTCG.LEADERS;

let selectedLeader = LEADERS[0];
let aiLeader = LEADERS[1] || LEADERS[0];
let selectedLeaderP2 = LEADERS[1] || LEADERS[0];

let p1Deck = [], p2Deck = [], hand = [], aiHand = [], p1Field = [], p2Field = [], p1Grave = [], p2Grave = [];
let p1DonDeck = [], p2DonDeck = [], p1DonReserve = [], p2DonReserve = [];
let customDeck = [];

let p1hp = 5, p2hp = 5, p1shield = 3, p2shield = 3;
let p1max = 3, p2max = 2, p1don = 3, p2don = 2;
let p1leaderDon = 0, p2leaderDon = 0;

let active = 1, turn = 1, gameOver = false, aiBusy = false, boost = 0, p2Boost = 0;

let battleStats = {
  damageDealt: 0,
  damageTaken: 0,
  unitsDefeated: 0,
  cardsPlayed: 0,
  donAttached: 0,
  turns: 1,
  startTime: Date.now()
};

function resetBattleStats() {
  battleStats = {
    damageDealt: 0,
    damageTaken: 0,
    unitsDefeated: 0,
    cardsPlayed: 0,
    donAttached: 0,
    turns: 1,
    startTime: Date.now()
  };
}

function emitBattleEvent(type, data = {}) {
  battleEventHistory.push({ type, turn, active, timestamp: Date.now(), ...data });
  if (battleEventHistory.length > 2000) battleEventHistory.shift();
}

function getBattleHistory() {
  return battleEventHistory.map(event => ({ ...event }));
}

function exportBattleReplay() {
  const replay = { version: replayExportVersion, game: 'Grand Legends TCG', events: getBattleHistory() };
  const blob = new Blob([JSON.stringify(replay, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gltcg-replay-' + Date.now() + '.json';
  link.click();
  URL.revokeObjectURL(url);
}

let localMode = "ai";
let attackSelection = null;
let p2AttackSelection = null;
let leaderAbilityUsed = false;
let leaderAbilityUsedP2 = false;
let shadowUsedP1 = false, shadowUsedP2 = false;
let awakenedThisTurnP1 = false, awakenedThisTurnP2 = false;
let rabbitHoleUsed = false;
let comboP1 = 0, comboP2 = 0;
let comboBonusP1 = 0, comboBonusP2 = 0;
let collisionLeaderUsedP1 = false, collisionLeaderUsedP2 = false;
let lastResolvedAbility = null;
let resolvingRepeatedAbility = false;
let battleEventHistory = [];
let replayExportVersion = 1;
let selectedDonIndex = null;
let deckBuilderOpenedFrom = 'menu';
let currentLeaderFilter = 'ALL';

const COLLECTION_KEY = "gltcg_collection_v21";
const PACK_KEY = "gltcg_pack_openings_v22";
const PROGRESS_KEY = "GLTCG_PROGRESS_V1";
const ACCOUNTS_KEY = "GLTCG_ACCOUNTS_V1";
const SESSION_KEY = "GLTCG_SESSION_V1";
const STORAGE_SCHEMA_VERSION = 2;
const STORAGE_SCHEMA_KEY = "GLTCG_STORAGE_SCHEMA";

function loadStoredObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch (e) {
    return {};
  }
}

function migrateStorage() {
  const currentVersion = Number(localStorage.getItem(STORAGE_SCHEMA_KEY) || 1);
  const migrated = {
    collection: loadStoredObject(COLLECTION_KEY),
    packOpenings: Math.max(10, Number(localStorage.getItem(PACK_KEY) || 10) || 10),
    progress: loadStoredObject(PROGRESS_KEY),
    accounts: loadStoredObject(ACCOUNTS_KEY)
  };

  Object.keys(migrated.progress).forEach(username => {
    const progress = migrated.progress[username];
    if (!progress || typeof progress !== 'object') {
      delete migrated.progress[username];
      return;
    }
    progress.collection = progress.collection && typeof progress.collection === 'object' ? progress.collection : {};
    progress.customDeck = Array.isArray(progress.customDeck) ? progress.customDeck : [];
    progress.packOpenings = Math.max(10, Number(progress.packOpenings) || 10);
    progress.schemaVersion = STORAGE_SCHEMA_VERSION;
  });

  Object.keys(migrated.accounts).forEach(username => {
    const account = migrated.accounts[username];
    if (!account || typeof account !== 'object') {
      delete migrated.accounts[username];
      return;
    }
    account.collection = account.collection && typeof account.collection === 'object' ? account.collection : {};
    account.packOpenings = Math.max(10, Number(account.packOpenings) || 10);
    account.wins = Math.max(0, Number(account.wins) || 0);
    account.losses = Math.max(0, Number(account.losses) || 0);
    account.level = Math.max(1, Number(account.level) || 1);
    account.schemaVersion = STORAGE_SCHEMA_VERSION;
  });

  if (currentVersion < STORAGE_SCHEMA_VERSION) {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(migrated.collection));
    localStorage.setItem(PACK_KEY, String(migrated.packOpenings));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(migrated.progress));
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(migrated.accounts));
    localStorage.setItem(STORAGE_SCHEMA_KEY, String(STORAGE_SCHEMA_VERSION));
  }
  return migrated;
}

const migratedStorage = migrateStorage();
let collection = migratedStorage.collection;
let packOpenings = migratedStorage.packOpenings;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cloneCard(c) {
  return { ...c, rarity: c.rarity || "Común" };
}

function validateCard(card) {
  return GLTCG.rules.validateCardData(card);
}

function validateCardLibrary() {
  const errors = [];
  const ids = new Set();
  LIBRARY.forEach(card => {
    const result = validateCard(card);
    if (!result.valid) errors.push(card?.id || 'carta desconocida', ...result.errors);
    if (card?.id && ids.has(card.id)) errors.push('Id de carta duplicado: ' + card.id);
    if (card?.id) ids.add(card.id);
  });
  if (errors.length) console.warn('Errores en el catálogo de cartas:', errors);
  return { valid: errors.length === 0, errors };
}

function validateCustomDeck(deckCards = customDeck) {
  return GLTCG.rules.validateDeckData(deckCards, LIBRARY);
}

function validateGameState() {
  if (localStorage.getItem('GLTCG_DEBUG_VALIDATION') !== '1') return { valid: true, errors: [] };
  const errors = [];
  const seen = new Set();
  const zones = [p1Deck, p2Deck, hand, aiHand, p1Field, p2Field, p1Grave, p2Grave];
  zones.forEach(zone => zone.forEach(card => {
    if (seen.has(card)) errors.push('La misma instancia de carta aparece en varias zonas.');
    seen.add(card);
  }));
  if (p1hp < 0 || p2hp < 0 || p1shield < 0 || p2shield < 0) errors.push('Vida o escudos negativos.');
  if (p1DonReserve.length > p1max || p2DonReserve.length > p2max) errors.push('Reserva DON por encima del máximo.');
  if (comboValue(1) < 0 || comboValue(2) < 0) errors.push('Combo negativo.');
  if (errors.length) console.warn('Estado de partida inválido:', errors);
  return { valid: errors.length === 0, errors };
}

window.addEventListener('DOMContentLoaded', validateCardLibrary);

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}"); } catch (e) { return {}; }
}

async function hashLocalPassword(password) {
  if (!crypto?.subtle) return 'legacy:' + password;
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return 'sha256:' + Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyLocalPassword(account, password) {
  if (account.passwordHash) return account.passwordHash === await hashLocalPassword(password);
  return account.password === password;
}

function saveAccounts(a) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
}

function currentUser() {
  return localStorage.getItem(SESSION_KEY) || "";
}

function saveCollection() {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  localStorage.setItem(PACK_KEY, String(packOpenings));
  const cc = document.getElementById("collectionCount");
  const pc = document.getElementById("packCount");
  if (cc) cc.textContent = Object.values(collection).reduce((a, b) => a + b, 0);
  if (pc) pc.textContent = packOpenings;
  syncAccountProgress();
  saveCurrentProgress();
}

function syncAccountProgress() {
  const k = currentUser(), a = getAccounts();
  if (k && a[k]) {
    a[k].collection = collection;
    a[k].packOpenings = Math.max(10, packOpenings);
    saveAccounts(a);
  }
}

function getProgressStore() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (e) { return {}; }
}

function saveProgressStore(x) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(x));
}

function captureProgress() {
  return {
    collection: collection,
    packOpenings: Math.max(10, Number(packOpenings) || 10),
    customDeck: customDeck,
    wins: 0, losses: 0, level: 1,
    savedAt: Date.now()
  };
}

function saveCurrentProgress() {
  const k = currentUser(); if (!k) return;
  const a = getAccounts(), u = a[k]; if (!u) return;
  const old = getProgressStore()[k] || {};
  const now = captureProgress();
  now.wins = Number(old.wins || u.wins || 0);
  now.losses = Number(old.losses || u.losses || 0);
  now.level = Number(old.level || u.level || 1);
  const all = getProgressStore();
  all[k] = now;
  saveProgressStore(all);
}

function loadCurrentProgress() {
  const k = currentUser(); if (!k) return;
  const a = getAccounts(), u = a[k];
  const p = getProgressStore()[k];
  if (p && p.collection) collection = p.collection;
  else if (u && u.collection) collection = u.collection;
  if (p && typeof p.packOpenings !== "undefined") packOpenings = Math.max(10, Number(p.packOpenings) || 10);
  else if (u && typeof u.packOpenings !== "undefined") packOpenings = Math.max(10, Number(u.packOpenings) || 10);
  if (p && Array.isArray(p.customDeck)) customDeck = p.customDeck;
}

function rarityClass(r) {
  return r === "Ultra Rara" ? "ultra" : r === "Súper Rara" ? "super" : r === "Rara" ? "rare" : "";
}

function rarityWeight() {
  let x = Math.random();
  return x < .05 ? "Ultra Rara" : x < .15 ? "Súper Rara" : x < .40 ? "Rara" : "Común";
}

function boosterCard() {
  let wanted = rarityWeight(), pool = LIBRARY.filter(c => (c.rarity || "Común") === wanted);
  if (!pool.length) pool = LIBRARY;
  return cloneCard(pool[Math.floor(Math.random() * pool.length)]);
}

/* ==========================================================================
   NAVEGACIÓN Y CONTROL DE VISTAS (MODALES Y MENÚ)
   ========================================================================== */
function showGame() {
  const a = document.getElementById("gameApp"), h = document.getElementById("gameHeader");
  if (a) a.style.display = "block";
  if (h) h.style.display = "block";
}

function hideGame() {
  const a = document.getElementById("gameApp"), h = document.getElementById("gameHeader");
  if (a) a.style.display = "none";
  if (h) h.style.display = "none";
}

function openMainMenu() {
  saveCollection();
  const m = document.getElementById("mainMenu");
  if (m) m.classList.add("open");
}

function closeMainMenu() {
  const m = document.getElementById("mainMenu");
  if (m) m.classList.remove("open");
}

function openLocalMode() {
  closeMainMenu();
  document.getElementById("localModeModal")?.classList.add("open");
}

function closeLocalMode() {
  document.getElementById("localModeModal")?.classList.remove("open");
}

function startLocalAI() {
  localMode = "ai";
  closeLocalMode();
  openLeaderForLocal();
}

function startLocalPVP() {
  localMode = "pvp";
  closeLocalMode();
  openLeaderForLocal();
}

function openLeaderForLocal() {
  const lm = document.getElementById("leaderModal");
  if (lm) {
    renderLeaderChoices(1);
    lm.classList.add("open");
  } else {
    showGame();
    reset();
  }
}

function closeLeaderModal() {
  const lm = document.getElementById("leaderModal");
  if (lm) lm.classList.remove("open");
  openLocalMode();
}

function filterLeadersBySet(setName, btn) {
  currentLeaderFilter = setName;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderLeaderChoices(1);
}

function renderLeaderChoices(player = 1) {
  const box = document.getElementById('leaderChoices');
  if (!box) return;
  box.innerHTML = '';
  const filter = typeof currentLeaderFilter !== 'undefined' ? currentLeaderFilter : 'ALL';
  const list = LEADERS.filter(l => {
    if (filter === 'ALL') return true;
    const s = l.id.startsWith('A') ? 'AWAKENING' : l.id.startsWith('S') ? 'SHADOWS' : l.id.startsWith('C') ? 'COLLISION' : l.id.startsWith('R') ? 'RABBIT HOLE' : 'ORIGINS';
    return s === filter;
  });
  list.forEach(l => {
    const e = document.createElement('div');
    e.className = 'leader-choice';
    const leaderSet = l.id.startsWith('A') ? 'AWAKENING' : l.id.startsWith('S') ? 'SHADOWS' : l.id.startsWith('C') ? 'COLLISION' : l.id.startsWith('R') ? 'RABBIT HOLE' : 'ORIGINS';
    e.innerHTML = '<div class="leader-choice-art">' + l.art + '</div>' +
                  '<h2>' + l.name + '</h2>' +
                  '<div class="badge">' + leaderSet + ' · ' + l.color + '</div>' +
                  '<p>❤️ ' + l.life + ' vidas</p>' +
                  '<p>' + l.ability + '</p>' +
                  '<button type="button">👑 Elegir a ' + l.name + '</button>';
    e.querySelector('button').onclick = () => selectLeader(l.id, player);
    box.appendChild(e);
  });
  if (!list.length) {
    box.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; opacity:0.7">No hay líderes en esta categoría.</div>';
  }
}

function selectLeader(id, player = 1) {
  const found = LEADERS.find(l => l.id === id) || LEADERS[0];
  if (player === 2) {
    selectedLeaderP2 = found;
    document.getElementById('leaderModal')?.classList.remove('open');
    showGame();
    reset();
    return;
  }
  selectedLeader = found;
  const others = LEADERS.filter(l => l.id !== found.id);
  aiLeader = others[Math.floor(Math.random() * Math.max(1, others.length))] || LEADERS[0];
  localStorage.setItem('GLTCG_SELECTED_LEADER', selectedLeader.id);
  
  if (localMode === 'pvp') {
    selectedLeaderP2 = null;
    const lm = document.getElementById('leaderModal');
    if (lm) {
      const box = document.getElementById('leaderChoices');
      if (box) {
        box.innerHTML = '<h2 style="grid-column:1/-1; text-align:center;">👥 PLAYER 2: ELIGE TU LÍDER</h2>';
      }
      renderLeaderChoices(2);
      lm.classList.add('open');
    }
    return;
  }
  document.getElementById('leaderModal')?.classList.remove('open');
  showGame();
  reset();
}

function startGame() {
  startLocalAI();
}

function confirmExitToMenu() {
  if (!gameOver && (p1Field.length > 0 || turn > 1)) {
    if (confirm("¿Deseas salir al Menú Principal? Se pausará la partida actual.")) {
      openMainMenu();
    }
  } else {
    openMainMenu();
  }
}

/* ==========================================================================
   CONSTRUCTOR DE MAZOS (DECK BUILDER)
   ========================================================================== */
function openDeckBuilderFromMenu() {
  deckBuilderOpenedFrom = 'menu';
  closeMainMenu();
  showGame();
  openDeckBuilder();
  const backBtn = document.getElementById('btnBackFromDeck');
  if (backBtn) backBtn.textContent = '⬅️ Volver al Menú Principal';
}

function openDeckBuilder() {
  if (deckBuilderOpenedFrom !== 'menu') deckBuilderOpenedFrom = 'battle';
  const backBtn = document.getElementById('btnBackFromDeck');
  if (backBtn) {
    backBtn.textContent = (deckBuilderOpenedFrom === 'battle') ? '⬅️ Volver a la Batalla' : '⬅️ Volver al Menú Principal';
  }
  const m = document.getElementById('deckModal');
  if (m) m.classList.add('open');
  renderDeckBuilder();
}

function closeDeckBuilder() {
  const m = document.getElementById("deckModal");
  if (m) m.classList.remove("open");
}

function handleDeckBuilderBack() {
  closeDeckBuilder();
  if (deckBuilderOpenedFrom === 'menu') {
    openMainMenu();
  }
}

function renderDeckBuilder() {
  let search = document.getElementById("search"), g = document.getElementById("deckGrid");
  if (!g) return;
  let q = (search ? search.value : "").toLowerCase();
  let sf = document.getElementById('setFilter');
  let sv = sf ? sf.value : 'ALL';
  g.innerHTML = "";
  const dc = document.getElementById("deckCount");
  if (dc) dc.textContent = customDeck.length;
  const deckValidation = validateCustomDeck();
  const validationMessage = document.getElementById('deckValidationMessage');
  if (validationMessage) {
    validationMessage.textContent = customDeck.length === 0
      ? 'Mazo predeterminado disponible.'
      : deckValidation.valid
        ? 'Mazo válido: listo para jugar.'
        : deckValidation.errors[0];
    validationMessage.className = deckValidation.valid ? 'deck-validation valid' : 'deck-validation invalid';
  }

  LIBRARY.filter(c => c.name.toLowerCase().includes(q) && (sv === 'ALL' || setOfCard(c) === sv)).forEach(c => {
    let count = customDeck.filter(x => x.name === c.name).length;
    let e = document.createElement("div");
    e.className = "deckitem";
    const cannotAdd = count >= 4 || customDeck.length >= 40;
    e.innerHTML = "<div style='font-size:40px'>" + (c.art || '🃏') + "</div><b>" + c.name + "</b><br>⚡ " + c.cost + " · 💥 " + c.power + "<br><small>⭐ " + (c.rarity || 'Común') + "</small><br><small>" + count + "/4 copias</small><br><button class='small' " + (cannotAdd ? "disabled" : "") + ">＋ Añadir</button> <button class='small' " + (count <= 0 ? "disabled" : "") + ">－ Quitar</button>";
    e.querySelectorAll("button")[0].onclick = () => { if (customDeck.length < 40 && count < 4) { customDeck.push(cloneCard(c)); renderDeckBuilder(); } };
    e.querySelectorAll("button")[1].onclick = () => {
      let ix = customDeck.findIndex(x => x.name === c.name);
      if (ix >= 0) customDeck.splice(ix, 1);
      renderDeckBuilder();
    };
    g.appendChild(e);
  });
}

/* ==========================================================================
   CATÁLOGO DE SETS Y APERTURA DE SOBRES
   ========================================================================== */
function openSets() {
  closeMainMenu();
  const modal = document.getElementById('setsModal');
  const grid = document.getElementById('setsGrid');
  if (!modal || !grid) return;
  grid.innerHTML = '';
  const catalog = (GLTCG && GLTCG.SETS) ? GLTCG.SETS : {};
  Object.values(catalog).forEach(setData => {
    const card = document.createElement('div');
    card.className = 'set-card';
    const cards = Array.isArray(setData.cards) ? setData.cards : [];
    const leaders = Array.isArray(setData.leaders) ? setData.leaders : [];
    card.innerHTML = '<h3>' + setData.name + '</h3><p>' + (setData.theme || '') + '</p><div class="set-count">🃏 ' + cards.length + ' cartas · 👑 ' + leaders.length + ' líderes</div><p>' + cards.map(c => '<span class="set-badge">' + c.id + '</span>').join('') + '</p>';
    grid.appendChild(card);
  });
  if (!grid.children.length) {
    grid.innerHTML = '<div class="set-card"><h3>📚 Sets no disponibles</h3><p>El catálogo todavía no se ha cargado.</p></div>';
  }
  modal.classList.add('open');
}

function closeSets() {
  document.getElementById('setsModal')?.classList.remove('open');
  openMainMenu();
}

function setOfCard(c) {
  if (c && c.id) return c.id.startsWith('A') ? 'AWAKENING' : c.id.startsWith('S') ? 'SHADOWS' : c.id.startsWith('C') ? 'COLLISION' : c.id.startsWith('R') ? 'RABBIT_HOLE' : 'ORIGINS';
  return 'ORIGINS';
}

function openPack() {
  saveCollection();
  if (document.getElementById("packResult")) document.getElementById("packResult").innerHTML = "";
  document.getElementById("packModal")?.classList.add("open");
  updatePackButton();
}

function closePack() {
  document.getElementById("packModal")?.classList.remove("open");
}

function updatePackButton() {
  const b = document.getElementById("openPackBtn");
  if (!b) return;
  b.textContent = packOpenings > 0 ? "✨ ABRIR SOBRE" : "🔒 SIN APERTURAS";
  b.disabled = packOpenings <= 0;
}

function openBooster() {
  if (packOpenings <= 0) {
    log("🔒 No tienes aperturas de sobres disponibles. Gana una partida para conseguir 10.");
    updatePackButton();
    return;
  }
  packOpenings--;
  let cards = Array.from({ length: 5 }, boosterCard), box = document.getElementById("packResult");
  if (box) box.innerHTML = "";
  cards.forEach(c => {
    collection[c.name] = (collection[c.name] || 0) + 1;
    let e = document.createElement("div");
    e.className = "card packcard " + rarityClass(c.rarity);
    e.innerHTML = "<div class='art'>" + (c.art || '🃏') + "</div><h3>" + c.name + "</h3><div>⚡ " + c.cost + " · 💥 " + c.power + "</div><div class='rarity'>✨ " + c.rarity + "</div><div class='ability'>" + (c.ability || '') + "</div>";
    if (box) box.appendChild(e);
  });
  saveCollection();
  updatePackButton();
  log("🎁 Abriste 1 sobre. Te quedan " + packOpenings + " aperturas.");
}

/* ==========================================================================
   CENTRO INFORMATIVO Y PERFIL PRE-BATALLA (SISTEMA DE PESTAÑAS)
   ========================================================================== */
function openPlayerHub(tab = 'profile') {
  const modal = document.getElementById('playerHubModal');
  if (modal) {
    modal.classList.add('open');
    switchHubTab(tab);
    renderHubProfile();
    setTimeout(() => modal.querySelector('button, input, select')?.focus(), 0);
  }
}

function closePlayerHub() {
  const modal = document.getElementById('playerHubModal');
  if (modal) modal.classList.remove('open');
}

function switchHubTab(tabName) {
  const tabs = ['profile', 'account', 'online', 'tactics'];
  tabs.forEach(t => {
    const btn = document.getElementById('hubTabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    const panel = document.getElementById('hubPanel' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === tabName);
    if (panel) {
      if (t === tabName) {
        panel.style.display = 'block';
        panel.classList.add('active');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    }
  });

  const pMsg = document.getElementById('hubProfileMsg');
  const aMsg = document.getElementById('hubAccountMsg');
  const oMsg = document.getElementById('hubOnlineMsg');
  if (pMsg) pMsg.textContent = '';
  if (aMsg) aMsg.textContent = '';
  if (oMsg) oMsg.textContent = '';

  if (tabName === 'profile') {
    renderHubProfile();
  }
}

function renderHubProfile() {
  const k = currentUser();
  const accounts = getAccounts();
  const user = accounts[k];
  const username = user ? user.username : (k ? k : 'Jugador Local');

  setText('menuUserName', username);
  setText('hubProfileUsername', '🏴‍☠️ ' + username);
  
  const wins = user ? (user.wins || 0) : 0;
  const losses = user ? (user.losses || 0) : 0;
  const level = user ? (user.level || 1) : 1;
  const totalCards = Object.values(collection).reduce((a, b) => a + b, 0);

  setText('hubStatWins', wins);
  setText('hubStatLosses', losses);
  setText('hubStatLevel', level);
  setText('hubStatCollection', totalCards);
  setText('hubStatPacks', packOpenings);

  const logoutBtn = document.getElementById('hubLogoutBtn');
  if (logoutBtn) {
    logoutBtn.style.display = user ? 'inline-flex' : 'none';
  }
}

function showHubAccountMode(mode) {
  const loginBox = document.getElementById('hubLoginBox');
  const registerBox = document.getElementById('hubRegisterBox');
  const loginTab = document.getElementById('hubLoginSubTab');
  const registerTab = document.getElementById('hubRegisterSubTab');

  if (loginBox) loginBox.style.display = mode === 'login' ? 'block' : 'none';
  if (registerBox) registerBox.style.display = mode === 'register' ? 'block' : 'none';
  if (loginTab) loginTab.classList.toggle('active', mode === 'login');
  if (registerTab) registerTab.classList.toggle('active', mode === 'register');
  
  const msg = document.getElementById('hubAccountMsg');
  if (msg) msg.textContent = '';
}

async function submitHubLogin() {
  const userEl = document.getElementById('hubLoginUser');
  const passEl = document.getElementById('hubLoginPass');
  const u = (userEl ? userEl.value : '').trim();
  const p = passEl ? passEl.value : '';
  const msg = document.getElementById('hubAccountMsg');

  if (!u || !p) {
    if (msg) msg.textContent = '⚠️ Por favor ingresa tu usuario y contraseña.';
    return;
  }

  const a = getAccounts();
  const k = u.toLowerCase();
  if (!a[k] || !await verifyLocalPassword(a[k], p)) {
    if (msg) msg.textContent = '⚠️ Usuario o contraseña incorrectos.';
    return;
  }

  if (a[k].password && !a[k].passwordHash) {
    a[k].passwordHash = await hashLocalPassword(p);
    delete a[k].password;
    saveAccounts(a);
  }

  localStorage.setItem(SESSION_KEY, k);
  collection = a[k].collection || {};
  packOpenings = Math.max(10, Number(a[k].packOpenings) || 10);
  loadCurrentProgress();
  saveCollection();

  if (msg) msg.textContent = '✅ ¡Bienvenido de nuevo, ' + u + '!';
  setTimeout(() => { switchHubTab('profile'); }, 400);
}

async function submitHubRegister() {
  const userEl = document.getElementById('hubRegisterUser');
  const passEl = document.getElementById('hubRegisterPass');
  const pass2El = document.getElementById('hubRegisterPass2');
  const u = (userEl ? userEl.value : '').trim();
  const p = passEl ? passEl.value : '';
  const p2 = pass2El ? pass2El.value : '';
  const msg = document.getElementById('hubAccountMsg');

  if (u.length < 3) {
    if (msg) msg.textContent = '⚠️ El usuario debe tener al menos 3 caracteres.';
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(u)) {
    if (msg) msg.textContent = '⚠️ Usa solo letras, números y guión bajo (_).';
    return;
  }
  if (p.length < 4) {
    if (msg) msg.textContent = '⚠️ La contraseña debe tener al menos 4 caracteres.';
    return;
  }
  if (p !== p2) {
    if (msg) msg.textContent = '⚠️ Las contraseñas no coinciden.';
    return;
  }

  const a = getAccounts();
  const k = u.toLowerCase();
  if (a[k]) {
    if (msg) msg.textContent = '⚠️ Ese nombre de usuario ya está registrado.';
    return;
  }

  a[k] = { username: u, passwordHash: await hashLocalPassword(p), wins: 0, losses: 0, level: 1, collection: {}, packOpenings: 10 };
  saveAccounts(a);
  localStorage.setItem(SESSION_KEY, k);
  collection = a[k].collection;
  packOpenings = 10;
  loadCurrentProgress();
  saveCollection();

  if (msg) msg.textContent = '✅ ¡Cuenta creada exitosamente! Has recibido 10 sobres de bienvenida.';
  setTimeout(() => { switchHubTab('profile'); }, 600);
}

function saveHubProfile() {
  syncAccountProgress();
  saveCollection();
  const msg = document.getElementById('hubProfileMsg');
  if (msg) msg.textContent = '💾 ¡Progreso, colección y sobres guardados con éxito!';
  setTimeout(() => { if (msg) msg.textContent = ''; }, 3000);
}

function logoutAccount() {
  localStorage.removeItem(SESSION_KEY);
  renderHubProfile();
  const msg = document.getElementById('hubProfileMsg');
  if (msg) msg.textContent = '🚪 Sesión cerrada.';
  setTimeout(() => { if (msg) msg.textContent = ''; }, 2000);
}

function saveHubServerUrl() {
  const input = document.getElementById('hubServerUrl');
  const msg = document.getElementById('hubOnlineMsg');
  if (input) {
    localStorage.setItem('GLTCG_SERVER_URL', input.value.trim());
    if (msg) msg.textContent = '💾 Servidor guardado: ' + input.value.trim();
  }
}

let hubCurrentRoomCode = '';
function createHubRoom() {
  const code = 'GL-' + Math.floor(1000 + Math.random() * 9000);
  hubCurrentRoomCode = code;
  const display = document.getElementById('hubOnlineRoomDisplay');
  const codeEl = document.getElementById('hubRoomCode');
  const statusEl = document.getElementById('hubRoomStatus');
  const startBtn = document.getElementById('hubOnlineStartBtn');

  if (codeEl) codeEl.textContent = code;
  if (statusEl) statusEl.textContent = '🟡 Sala creada. Esperando conexión del segundo jugador...';
  if (display) display.style.display = 'block';
  if (startBtn) startBtn.disabled = false;
}

function joinHubRoom() {
  const input = document.getElementById('hubJoinCode');
  const code = (input ? input.value : '').trim().toUpperCase();
  const msg = document.getElementById('hubOnlineMsg');
  if (!code || code.length < 4) {
    if (msg) msg.textContent = '⚠️ Por favor ingresa un código de sala válido.';
    return;
  }
  if (msg) msg.textContent = '🔗 Conectando a la sala ' + code + '...';
  setTimeout(() => {
    if (msg) msg.textContent = '✅ Conectado a la sala ' + code + '. Preparando combate.';
    setTimeout(() => {
      closePlayerHub();
      startLocalPVP();
    }, 800);
  }, 600);
}

function copyHubRoomCode() {
  if (!hubCurrentRoomCode) return;
  navigator.clipboard.writeText(hubCurrentRoomCode).then(() => {
    const statusEl = document.getElementById('hubRoomStatus');
    if (statusEl) statusEl.textContent = '📋 ¡Código copiado al portapapeles!';
  }).catch(() => {});
}

function startHubOnlineMatch() {
  closePlayerHub();
  startLocalPVP();
}

function openProfile() { openPlayerHub('profile'); }
function closeProfile() { closePlayerHub(); }
function openAccount() { openPlayerHub('account'); }
function closeAccount() { closePlayerHub(); }
function openOnline() { openPlayerHub('online'); }
function closeOnline() { closePlayerHub(); }
function openTutorial() { openPlayerHub('tactics'); }
function closeTutorial() { closePlayerHub(); }
function skipTutorial() { closePlayerHub(); }
function tutorialNext() { closePlayerHub(); startGame(); }

/* ==========================================================================
   LÓGICA DEL MOTOR DE BATALLA Y COMBATE JUSTO
   ========================================================================== */
function makeDeck() {
  let d = [];
  const customDeckValidation = customDeck.length ? validateCustomDeck() : { valid: true };
  let source = customDeck.length && customDeckValidation.valid ? customDeck : LIBRARY;
  if (customDeck.length && !customDeckValidation.valid) {
    log('⚠️ Tu mazo personalizado no es válido. Se usará el mazo predeterminado.');
  }
  for (let c of source) {
    for (let i = 0; i < 4; i++) d.push(cloneCard(c));
  }
  while (d.length < 40) d.push(cloneCard(LIBRARY[d.length % LIBRARY.length]));
  return shuffle(d.slice(0, 40));
}

function makeDonDeck() {
  return shuffle(Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: "DON!", type: "DON" })));
}

function log(t) {
  emitBattleEvent('LOG', { message: String(t) });
  const x = document.getElementById("log");
  if (x) {
    const entry = document.createElement('div');
    entry.textContent = '• ' + t;
    x.prepend(entry);
  }
  arenaLog(t);
}

function arenaLog(t) {
  const x = document.getElementById("arenaLog");
  if (x) {
    const d = document.createElement("div");
    d.textContent = "• " + t;
    x.prepend(d);
  }
}

function setAIRealtime(t) {
  const x = document.getElementById("aiRealtime");
  if (x) {
    x.textContent = '🤖 ' + t;
    x.className = 'center ai-thinking';
  }
}

function clearAIRealtime() {
  const x = document.getElementById("aiRealtime");
  if (x) x.innerHTML = "";
}

function flashAttack() {
  const a = document.getElementById("battleArena");
  if (!a) return;
  const l = document.createElement("div");
  l.style.cssText = "position:absolute;left:25%;right:25%;top:50%;height:4px;background:#ffd65d;box-shadow:0 0 16px #ffd65d;z-index:5";
  a.appendChild(l);
  setTimeout(() => l.remove(), 500);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function canPlay() {
  return !gameOver && !aiBusy && (localMode === "pvp" || active === 1);
}

function drawP1() {
  if (p1Deck.length) hand.push(p1Deck.pop());
}

function drawP2() {
  if (p2Deck.length) aiHand.push(p2Deck.pop());
}

function drawDon(p) {
  if (p === 1 && p1DonDeck.length && p1DonReserve.length < p1max) {
    p1DonReserve.push(p1DonDeck.pop());
    return true;
  }
  if (p === 2 && p2DonDeck.length && p2DonReserve.length < p2max) {
    p2DonReserve.push(p2DonDeck.pop());
    return true;
  }
  return false;
}

function payP1(n) {
  if (p1DonReserve.length < n) return false;
  for (let i = 0; i < n; i++) p1DonReserve.pop();
  p1don = p1DonReserve.length;
  return true;
}

function payP2(n) {
  if (p2DonReserve.length < n) return false;
  for (let i = 0; i < n; i++) p2DonReserve.pop();
  p2don = p2DonReserve.length;
  return true;
}

function totalPower(c) {
  let n = c.power + (c.attached || 0) * 1000 + (c.tempBoost || 0);
  const p2Leader = localMode === 'pvp' && selectedLeaderP2 ? selectedLeaderP2 : aiLeader;
  if (selectedLeader?.id === 'L03' && (c.attached || 0) >= 2) n += 300;
  if (p2Leader?.id === 'L03' && p2Field.includes(c) && (c.attached || 0) >= 2) n += 300;
  if (p2Leader?.id === 'S04' && c._returnedFromGrave) n += 300;
  if (selectedLeader?.id === 'S04' && c._returnedFromGrave) n += 300;
  if (selectedLeader?.id === 'C43' && (c.attached || 0) >= 2) n += 300;
  if (p2Leader?.id === 'C43' && p2Field.includes(c) && (c.attached || 0) >= 2) n += 300;
  return n;
}

function showShadowStatus() {
  const e = document.getElementById('shadowStatus');
  if (e) e.textContent = 'P1: ' + (shadowUsedP1 ? '✅ usada' : '🟢 disponible') + ' · P2: ' + (shadowUsedP2 ? '✅ usada' : '🟢 disponible') + ' · Se activa cuando una carta sea derrotada.';
}

function comboValue(player) {
  return (player === 1 ? comboP1 : comboP2) + (player === 1 ? comboBonusP1 : comboBonusP2);
}

function addCombo(player, n = 1) {
  if (player === 1) comboP1 += n;
  else comboP2 += n;
  showComboStatus();
}

function comboHas(player, n) {
  return comboValue(player) >= n;
}

function showComboStatus() {
  const e = document.getElementById('comboStatus');
  if (e) e.textContent = 'P1: ' + comboValue(1) + ' · P2: ' + comboValue(2) + ' · Se reinicia al comenzar el siguiente turno.';
}

function applyCollisionCombo(c, player = 1, force = false) {
  if (!c || (!force && (!c.combo || !comboHas(player, c.combo)))) return;
  const field = player === 1 ? p1Field : p2Field;
  const handRef = player === 1 ? hand : aiHand;
  
  if (c.comboBoost) {
    const u = field.find(x => x === c) || field.find(x => x.id === c.id) || field[0];
    if (u) u.tempBoost = (u.tempBoost || 0) + c.comboBoost + (c.combo5Boost && comboHas(player, 5) ? c.combo5Boost : 0);
  }
  switch (c.comboEffect) {
    case 'draw1': player === 1 ? drawP1() : drawP2(); break;
    case 'draw2Discard': player === 1 ? (drawP1(), drawP1()) : (drawP2(), drawP2()); if (handRef.length) handRef.shift(); break;
    case 'ready': { const u = field.find(x => x.id === c.id) || field[0]; if (u) u.summoningSickness = false; break; }
    case 'debuff500': { const f = player === 1 ? p2Field : p1Field; if (f[0]) f[0].tempBoost = (f[0].tempBoost || 0) - 500; break; }
    case 'donRecover': { const d = player === 1 ? p1DonDeck : p2DonDeck, r = player === 1 ? p1DonReserve : p2DonReserve; if (d.length) r.push(d.pop()); break; }
    case 'boostOther500': { const u = field.find(x => x.id !== c.id) || field[0]; if (u) u.tempBoost = (u.tempBoost || 0) + 500; break; }
    case 'peekTop': { const d = player === 1 ? p1Deck : p2Deck; if (d.length) log('🔭 Combo: ' + d[d.length - 1].name + ' está arriba del mazo.'); break; }
    case 'peekHand': log('👀 Combo: mira una carta de la mano rival.'); break;
  }
  log('💥 ' + c.name + ' activó Combo ' + c.combo + '.');
}

function makeDonToken(i) {
  const d = document.createElement("div");
  d.className = "doncard";
  d.textContent = "🪙";
  d.draggable = true;
  d.tabIndex = 0;
  d.setAttribute('role', 'button');
  d.setAttribute('aria-label', 'DON disponible. Arrastra esta moneda a una unidad o lider.');
  d.title = "Arrastra este DON a una carta o a tu Líder (+1000 poder)";
  d.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", String(i));
    e.dataTransfer.effectAllowed = "move";
    d.classList.add("dragging");
  });
  d.addEventListener("dragend", () => d.classList.remove("dragging"));
  d.addEventListener('click', () => {
    selectedDonIndex = selectedDonIndex === i ? null : i;
    d.classList.toggle('selected', selectedDonIndex === i);
  });
  d.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      d.click();
    }
  });
  return d;
}

function setupDropZone(el, kind, index) {
  if (!el || el.dataset.donDropReady) return;
  el.dataset.donDropReady = "1";
  el.addEventListener('click', event => {
    if (event.target !== el || selectedDonIndex === null || !canPlay()) return;
    const donIndex = selectedDonIndex;
    if (!p1DonReserve[donIndex]) return;
    p1DonReserve.splice(donIndex, 1);
    selectedDonIndex = null;
    p1don = p1DonReserve.length;
    if (kind === 'leader') {
      p1leaderDon++;
      log('🪙 DON adjuntado al Líder: +1000 poder.');
    } else if (p1Field[index]) {
      p1Field[index].attached = (p1Field[index].attached || 0) + 1;
      log('🪙 DON adjuntado a ' + p1Field[index].name + ': +1000 poder.');
    }
    render();
  });
  el.addEventListener("dragover", e => {
    if (canPlay() && p1DonReserve.length) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      el.classList.add("dragover");
    }
  });
  el.addEventListener("dragleave", () => el.classList.remove("dragover"));
  el.addEventListener("drop", e => {
    e.preventDefault();
    el.classList.remove("dragover");
    if (!canPlay() || !p1DonReserve.length) return;
    let i = Number(e.dataTransfer.getData("text/plain"));
    if (!p1DonReserve[i]) return;
    p1DonReserve.splice(i, 1);
    p1don = p1DonReserve.length;
    if (kind === "leader") {
      p1leaderDon++;
      log("🪙 DON adjuntado al Líder: +1000 poder.");
    } else {
      p1Field[index].attached = (p1Field[index].attached || 0) + 1;
      log("🪙 DON adjuntado a " + p1Field[index].name + ": +1000 poder.");
    }
    render();
  });
}

/* ==========================================================================
   SELECCIÓN DE ATAQUES Y CONDICIÓN DE GUARDIA DE CAMPO
   ========================================================================== */
function clearTargets() {
  document.querySelectorAll(".targetable").forEach(e => e.classList.remove("targetable"));
}

function chooseArenaAttack(i) {
  if (!canPlay() || !p1Field[i]) return;
  const c = p1Field[i];
  
  // REGLA 1: Cartas recién puestas no pueden atacar hasta su siguiente turno
  if (c.summoningSickness) {
    log('⏳ ' + c.name + ' acaba de entrar al campo. Debe esperar hasta tu próximo turno para atacar.');
    return;
  }
  
  // REGLA 2: Evitar ataques infinitos (máximo 1 ataque por turno)
  if (c.hasAttacked) {
    log('❌ ' + c.name + ' ya ha realizado su ataque este turno.');
    return;
  }
  
  attackSelection = i;
  clearTargets();
  
  // REGLA 3: Si hay cartas del oponente en el campo, NO pueden atacar lifepoints o shield directamente
  if (p2Field.length === 0 || c.canAttackLeader) {
    document.getElementById("arenaP2Leader")?.classList.add("targetable");
    arenaLog("🎯 " + c.name + " puede atacar directamente al Líder rival o sus escudos.");
  } else {
    arenaLog("🛡️ Hay personajes en el campo enemigo. " + c.name + " debe atacar a los defensores antes de dañar al Líder.");
  }
  
  p2Field.forEach((_, j) => {
    const e = document.querySelector('#arenaP2Field .arena-unit[data-index="' + j + '"]');
    if (e) e.classList.add("targetable");
  });
}

function selectLeaderTarget(p) {
  // P1 ataca al Líder de P2 / IA
  if (p === 2 && attackSelection !== null && canPlay()) {
    if (!GLTCG.rules.canAttackLeaderThroughField(p1Field[attackSelection], p2Field)) {
      log('🛡️ ¡GUARDIA DE CAMPO! No puedes atacar directamente los escudos o vidas del Líder mientras haya personajes enemigos en juego.');
      return;
    }
    clearTargets();
    flashAttack();
    attackLeader();
    attackSelection = null;
    return;
  }
  
  // P2 ataca al Líder de P1 (PVP Local)
  if (p === 1 && localMode === "pvp" && p2AttackSelection !== null && active === 2) {
    if (!GLTCG.rules.canAttackLeaderThroughField(p2Field[p2AttackSelection], p1Field)) {
      log('🛡️ ¡GUARDIA DE CAMPO! No puedes atacar directamente los escudos o vidas del Líder mientras haya personajes de PLAYER 1 en juego.');
      return;
    }
    clearTargets();
    flashAttack();
    attackLeaderP2();
    p2AttackSelection = null;
    return;
  }
}

function chooseArenaCharacter(j) {
  if (localMode === "pvp" && active === 2 && p2AttackSelection !== null) {
    const i = p2AttackSelection;
    clearTargets();
    flashAttack();
    attackCharacterP2(i, j);
    p2AttackSelection = null;
    return;
  }
  if (attackSelection === null || !canPlay()) return;
  const i = attackSelection;
  clearTargets();
  flashAttack();
  attackCharacter(i, j);
  attackSelection = null;
}

function resolveBlockerTarget(field, targetIndex, defenderName) {
  const target = field[targetIndex];
  if (!target || target.blocker) return targetIndex;

  const blockerIndex = field.findIndex(card => card.blocker);
  if (blockerIndex < 0) return targetIndex;

  const useBlocker = confirm("🛡️ " + field[blockerIndex].name + " puede interceptar el ataque. ¿Redirigirlo a BLOCKER?");
  if (!useBlocker) return targetIndex;
  log("🛡️ " + defenderName + " redirigió el ataque hacia " + field[blockerIndex].name + ".");
  return blockerIndex;
}

function chooseArenaAttackP2(i) {
  if (localMode !== "pvp" || active !== 2 || !p2Field[i]) return;
  const c = p2Field[i];
  
  if (c.summoningSickness) {
    log('⏳ ' + c.name + ' acaba de entrar al campo. No puede atacar hasta el próximo turno de PLAYER 2.');
    return;
  }
  if (c.hasAttacked) {
    log('❌ ' + c.name + ' ya ha realizado su ataque este turno.');
    return;
  }
  
  p2AttackSelection = i;
  clearTargets();
  
  if (p1Field.length === 0 || c.canAttackLeader) {
    document.getElementById("arenaP1Leader")?.classList.add("targetable");
    arenaLog("🎯 PLAYER 2: " + c.name + " puede atacar directamente al Líder de PLAYER 1.");
  } else {
    arenaLog("🛡️ Hay defensores en el campo de PLAYER 1. PLAYER 2 debe atacar primero a los personajes.");
  }
  
  p1Field.forEach((_, j) => {
    const e = document.querySelector('#arenaP1Field .arena-unit[data-index="' + j + '"]');
    if (e) e.classList.add("targetable");
  });
}

function attackCharacter(i, j) {
  let a = p1Field[i];
  if (!a) return;
  j = resolveBlockerTarget(p2Field, j, "PLAYER 2");
  let t = p2Field[j];
  if (!t) return;
  if (a.summoningSickness) {
    log('⏳ Este personaje acaba de entrar y no puede atacar todavía.');
    return;
  }
  if (a.hasAttacked && !a.secondAttackBoost) {
    log('❌ Este personaje ya atacó este turno.');
    return;
  }
  
  a.hasAttacked = true;
  addCombo(1, 1);
  if (selectedLeader.id === 'L01' && !leaderAbilityUsed) {
    a.tempBoost = (a.tempBoost || 0) + 500;
    leaderAbilityUsed = true;
    log('🌅 Kael activa su habilidad: +500 poder este combate.');
  }
  if (selectedLeader.id === 'C41' && comboHas(1, 2) && !collisionLeaderUsedP1) {
    a.tempBoost = (a.tempBoost || 0) + 500;
    collisionLeaderUsedP1 = true;
    log('💥 Raze: +500 por Combo 2.');
  }
  
  let ap = totalPower(a) + (a.secondAttackBoost || 0), tp = totalPower(t);
  a.secondAttackBoost = 0;
  if (a.attackBoost) ap += a.attackBoost;
  log('⚔️ ' + a.name + ' (' + ap + ') ataca a ' + t.name + ' (' + tp + ').');
  
  if (ap > tp) {
    const defeated = p2Field.splice(j, 1)[0];
    p2Grave.push(defeated);
    log('💥 ' + t.name + ' fue KO. ' + a.name + ' sobrevive.');
    notifyDefeat(defeated, 2);
    if (selectedLeader.id === 'S03' && !leaderAbilityUsed) {
      a.tempBoost = (a.tempBoost || 0) + 700;
      leaderAbilityUsed = true;
      log('🔥 Drazek: +700 por derrotar un personaje.');
    }
  } else if (ap < tp) {
    const defeated = p1Field.splice(i, 1)[0];
    p1Grave.push(defeated);
    log('💀 ' + a.name + ' fue KO. ' + t.name + ' sobrevive.');
    notifyDefeat(defeated, 1);
  } else {
    const d2 = p2Field.splice(j, 1)[0], d1 = p1Field.splice(i, 1)[0];
    p2Grave.push(d2);
    p1Grave.push(d1);
    log('💥 Empate: ambos personajes fueron KO.');
    notifyDefeat(d2, 2);
    notifyDefeat(d1, 1);
  }
  checkWin();
  render();
}

function attackLeader() {
  if (!canPlay() || attackSelection === null || !p1Field[attackSelection]) return;
  const a = p1Field[attackSelection];
  
  if (a.summoningSickness) {
    log('⏳ Este personaje acaba de entrar y no puede atacar todavía.');
    return;
  }
  if (a.hasAttacked) {
    log('❌ Este personaje ya atacó este turno.');
    return;
  }
  
  if (!GLTCG.rules.canAttackLeaderThroughField(a, p2Field)) {
    log('🛡️ ¡No puedes atacar directamente al Líder rival mientras tenga personajes defendiendo el campo!');
    return;
  }
  
  a.hasAttacked = true;
  a.canAttackLeader = false;
  addCombo(1, 1);
  
  if (p2shield > 0) {
    p2shield--;
    log("👑 ¡Ataque al Líder rival! Rompiste 1 🛡️.");
  } else if (p2hp <= 0 && tryRabbitHole(2)) {
    log("🐇 RABBIT HOLE: el Líder rival estaba en 0 ❤️ y evitó el golpe final.");
  } else {
    p2hp = Math.max(0, p2hp - 1);
    log("👑 ¡Ataque directo al Líder rival! Perdió 1 ❤️.");
  }
  checkWin();
  render();
}

function attackCharacterP2(i, j) {
  let a = p2Field[i];
  if (!a) return;
  j = resolveBlockerTarget(p1Field, j, "PLAYER 1");
  let t = p1Field[j];
  if (!t || a.summoningSickness || (a.hasAttacked && !a.secondAttackBoost)) return;
  
  a.hasAttacked = true;
  addCombo(2, 1);
  if (selectedLeaderP2?.id === 'C41' && comboHas(2, 2) && !collisionLeaderUsedP2) {
    a.tempBoost = (a.tempBoost || 0) + 500;
    collisionLeaderUsedP2 = true;
  }
  let ap = totalPower(a) + (a.attackBoost || 0) + (a.secondAttackBoost || 0), tp = totalPower(t);
  a.secondAttackBoost = 0;
  log('⚔️ PLAYER 2: ' + a.name + ' (' + ap + ') ataca a ' + t.name + ' (' + tp + ').');
  
  if (ap > tp) {
    const d = p1Field.splice(j, 1)[0];
    p1Grave.push(d);
    log('💥 ' + d.name + ' fue KO.');
    notifyDefeat(d, 1);
    if (selectedLeaderP2?.id === 'S03' && !leaderAbilityUsedP2) {
      a.tempBoost = (a.tempBoost || 0) + 700;
      leaderAbilityUsedP2 = true;
    }
  } else if (ap < tp) {
    const d = p2Field.splice(i, 1)[0];
    p2Grave.push(d);
    log('💥 ' + d.name + ' fue KO.');
    notifyDefeat(d, 2);
  } else {
    const d1 = p1Field.splice(j, 1)[0], d2 = p2Field.splice(i, 1)[0];
    p1Grave.push(d1);
    p2Grave.push(d2);
    log('💥 Empate: ambos personajes fueron KO.');
    notifyDefeat(d1, 1);
    notifyDefeat(d2, 2);
  }
  checkWin();
  render();
}

function attackLeaderP2() {
  if (localMode !== "pvp" || active !== 2 || gameOver || p2AttackSelection === null || !p2Field[p2AttackSelection]) return;
  const a = p2Field[p2AttackSelection];
  if (a.summoningSickness || a.hasAttacked) return;
  
  if (!GLTCG.rules.canAttackLeaderThroughField(a, p1Field)) {
    log('🛡️ ¡PLAYER 2 no puede atacar directamente al Líder mientras haya personajes defendiendo el campo!');
    return;
  }
  
  a.hasAttacked = true;
  a.canAttackLeader = false;
  addCombo(2, 1);
  if (selectedLeaderP2?.id === 'C41' && comboHas(2, 2) && !collisionLeaderUsedP2) {
    a.tempBoost = (a.tempBoost || 0) + 500;
    collisionLeaderUsedP2 = true;
  }
  if (p1shield > 0) {
    p1shield--;
    log("👑 PLAYER 2 atacó al Líder y rompió 1 🛡️.");
  } else if (p1hp <= 0 && tryRabbitHole(1)) {
    log("🐇 RABBIT HOLE: PLAYER 1 estaba en 0 ❤️ y evitó el golpe final.");
  } else {
    p1hp = Math.max(0, p1hp - 1);
    log("👑 PLAYER 2 dañó al Líder por 1 ❤️.");
  }
  checkWin();
  render();
}

function damageShield(player, n) {
  emitBattleEvent('SHIELD_DAMAGE', { player, amount: n });
  if (player === 1) {
    let k = Math.min(n, p1shield);
    p1shield -= k;
    p1hp = Math.max(0, p1hp - (n - k));
    log("💥 P1 perdió " + k + " escudo(s).");
  } else {
    let k = Math.min(n, p2shield);
    p2shield -= k;
    p2hp = Math.max(0, p2hp - (n - k));
    log("💥 P2 perdió " + k + " escudo(s).");
  }
}

function chooseEnemyIndex(maxPower = Infinity, player = 1) {
  const field = player === 1 ? p2Field : p1Field;
  if (!field.length) return -1;
  let candidates = field.map((c, i) => ({ c, i })).filter(x => totalPower(x.c) <= maxPower);
  return (candidates.length ? candidates : field.map((c, i) => ({ c, i }))).sort((a, b) => totalPower(a.c) - totalPower(b.c))[0]?.i ?? -1;
}

function playCardForPlayer(player, index, fromAI = false) {
  battleStats.cardsPlayed++;
  if (gameOver || (player === 1 && !canPlay()) || (player === 2 && !fromAI && (localMode !== 'pvp' || active !== 2))) return false;

  const ownHand = player === 1 ? hand : aiHand;
  const ownField = player === 1 ? p1Field : p2Field;
  const card = ownHand[index];
  const pay = player === 1 ? payP1 : payP2;
  if (!card) return false;
  if (!pay(card.cost)) {
    log('❌ ' + (player === 1 ? 'No tienes' : 'PLAYER 2 no tiene') + ' suficientes DON en reserva.');
    return false;
  }

  ownHand.splice(index, 1);
  emitBattleEvent('PLAY_CARD', { player, cardId: card.id, cardName: card.name });
  addCombo(player, 1);
  log('🎴 ' + (player === 1 ? 'Jugaste ' : 'PLAYER 2 jugó ') + card.name + '.');

  if (player === 1 && selectedLeader.id === 'L02' && card.type === 'Evento' && !leaderAbilityUsed) {
    drawP1();
    leaderAbilityUsed = true;
    log('🌌 Lyra: robaste 1 carta por jugar un Evento.');
  }

  if (card.type === 'Evento' || card.type === 'Recurso') {
    applyCardEffect(card, player);
    applyCollisionCombo(card, player);
  } else {
    const unit = cloneCard(card);
    Object.assign(unit, GLTCG.rules.createUnitState(card, player === 1 ? boost : p2Boost));
    unit.tempBoost += cardPowerBonus(unit, player);
    ownField.push(unit);
    applyCardEffect(card, player);
    if (unit.awakening) triggerAwakening(unit, player, false);
    applyCollisionCombo(unit, player);
  }
  checkWin();
  render();
  return true;
}

function playCard(i) {
  playCardForPlayer(1, i);
}

function playCardP2(i) {
  playCardForPlayer(2, i);
}

function applyCardEffect(c, player = 1) {
  const e = c.effect || c.onPlay;
  if (e !== 'reuseAbility' && !resolvingRepeatedAbility) lastResolvedAbility = { card: c, player: player };
  const ownHand = player === 1 ? hand : aiHand;
  const ownDeck = player === 1 ? p1Deck : p2Deck;
  const ownField = player === 1 ? p1Field : p2Field;
  const ownGrave = player === 1 ? p1Grave : p2Grave;
  const enemyField = player === 1 ? p2Field : p1Field;
  const enemyGrave = player === 1 ? p2Grave : p1Grave;
  const draw = player === 1 ? drawP1 : drawP2;
  const enemyPlayer = player === 1 ? 2 : 1;

  if (e === 'draw' || e === 'draw1') { draw(); log('🎴 ' + (player === 1 ? 'Robaste' : 'La IA robó') + ' 1 carta.'); }
  else if (e === 'draw2') { draw(); draw(); log('🎴 ' + (player === 1 ? 'Robaste' : 'La IA robó') + ' 2 cartas.'); }
  else if (e === 'draw3') { draw(); draw(); draw(); log('🎴 ' + (player === 1 ? 'Robaste' : 'La IA robó') + ' 3 cartas.'); }
  else if (e === 'drawDiscard') { draw(); if (ownHand.length) ownHand.shift(); }
  else if (e === 'draw2Discard') { draw(); draw(); if (ownHand.length) ownHand.shift(); }
  else if (e === 'peek2') {
    if (ownDeck.length) {
      const first = ownDeck.pop();
      const second = ownDeck.length ? ownDeck.pop() : null;
      ownHand.push(first);
      if (second) ownDeck.push(second);
      log('🔭 ' + (player === 1 ? 'Exploraste' : 'La IA exploró') + ' las primeras cartas.');
    }
  }
  else if (e === 'healshield') { if (player === 1 && p1shield < 5) p1shield++; if (player === 2 && p2shield < 5) p2shield++; }
  else if (e === 'shield') damageShield(enemyPlayer, 1);
  else if (e === 'boost700' || e === 'charge') { if (player === 1) boost += 700; else p2Boost += 700; }
  else if (e === 'debuff700' || e === 'debuff300') {
    const targetIndex = chooseEnemyIndex(Infinity, player);
    const target = targetIndex >= 0 ? enemyField[targetIndex] : null;
    if (target) target.tempBoost = (target.tempBoost || 0) - (e === 'debuff700' ? 700 : 300);
  }
  else if (e === 'break2') damageShield(enemyPlayer, 2);
  else if (e === 'recover') { if (ownGrave.length) ownHand.push(ownGrave.pop()); }
  else if (e === 'ko1500') {
    const i = chooseEnemyIndex(1500, player);
    if (i >= 0) { const defeated = enemyField.splice(i, 1)[0]; enemyGrave.push(defeated); notifyDefeat(defeated, enemyPlayer); }
  }
  else if (e === 'bounce1000') { const i = chooseEnemyIndex(1000, player); if (i >= 0) ownHand.push(enemyField.splice(i, 1)[0]); }
  else if (e === 'ready') { if (ownField.length) ownField[0].summoningSickness = false; }
  else if (e === 'prevent') window['_preventLeaderDamageP' + player] = true;
  else if (e === 'team300') ownField.forEach(x => x.tempBoost = (x.tempBoost || 0) + 300);
  else if (e === 'donRecover') { const donDeck = player === 1 ? p1DonDeck : p2DonDeck; const donReserve = player === 1 ? p1DonReserve : p2DonReserve; if (donDeck.length) donReserve.push(donDeck.pop()); }
  else if (e === 'comboPlus1' || e === 'comboPlus2' || e === 'comboPlus3') addCombo(player, Number(e.slice(-1)));
  else if (e === 'comboPlus3Temp') { if (player === 1) comboBonusP1 += 3; else comboBonusP2 += 3; }
  else if (e === 'collisionDraw') { draw(); if (comboHas(player, 3)) { draw(); if (ownHand.length) ownHand.shift(); } }
  else if (e === 'draw3Discard') { draw(); draw(); draw(); if (ownHand.length) ownHand.shift(); }
  else if (e === 'boost500' || e === 'collisionBoost800' || e === 'collisionBoostReady' || e === 'collisionBoostLeader' || e === 'legendCombo') {
    const target = ownField[0];
    if (target) {
      const amount = e === 'boost500' ? 500 : e === 'collisionBoost800' ? (comboHas(player, 2) ? 800 : 500) : e === 'collisionBoostReady' ? 1000 : e === 'collisionBoostLeader' ? 1500 : 2000;
      target.tempBoost = (target.tempBoost || 0) + amount;
      if ((e === 'collisionBoostReady' && comboHas(player, 3)) || (e === 'legendCombo' && comboHas(player, 5))) target.summoningSickness = false;
      if (e === 'collisionBoostLeader' && comboHas(player, 4)) target.canAttackLeader = true;
      if (e === 'legendCombo' && comboHas(player, 5)) target.hasAttacked = false;
    }
  }
  else if (e === 'secondAttack') {
    const target = ownField[0];
    if (target) {
      target.hasAttacked = false;
      target.secondAttackBoost = comboHas(player, 4) ? 500 : 0;
    }
  }
  else if (e === 'clearEnemyTemp' || e === 'stormCollision') {
    enemyField.forEach(target => target.tempBoost = (target.tempBoost || 0) - (e === 'stormCollision' ? 700 : target.tempBoost || 0));
  }
  else if (e === 'bounceCost4') {
    const i = enemyField.map((target, index) => ({ target, index })).filter(x => x.target.cost <= 4).sort((a, b) => totalPower(a.target) - totalPower(b.target))[0]?.index;
    if (typeof i === 'number') ownHand.push(enemyField.splice(i, 1)[0]);
  }
  else if (e === 'koCollision' || e === 'impactFinal') {
    const limit = e === 'koCollision' ? (comboHas(player, 5) ? 2500 : 1800) : 1500;
    const i = chooseEnemyIndex(limit, player);
    if (i >= 0) {
      if (e === 'impactFinal') enemyField[i].tempBoost = (enemyField[i].tempBoost || 0) - 1500;
      if (e === 'koCollision' || (comboHas(player, 4) && totalPower(enemyField[i]) <= 1500)) {
        const defeated = enemyField.splice(i, 1)[0];
        enemyGrave.push(defeated);
        notifyDefeat(defeated, enemyPlayer);
      }
    }
  }
  else if (e === 'donRecover2' || e === 'legendCore') {
    const donDeck = player === 1 ? p1DonDeck : p2DonDeck;
    const donReserve = player === 1 ? p1DonReserve : p2DonReserve;
    const amount = e === 'donRecover2' || e === 'legendCore' ? 2 : 1;
    for (let i = 0; i < amount && donDeck.length; i++) donReserve.push(donDeck.pop());
    if (e === 'legendCore') { draw(); draw(); draw(); draw(); }
  }
  else if (e === 'reuseAbility') {
    if (lastResolvedAbility && !resolvingRepeatedAbility) {
      resolvingRepeatedAbility = true;
      applyCardEffect(lastResolvedAbility.card, lastResolvedAbility.player);
      resolvingRepeatedAbility = false;
    } else {
      log('⏳ No hay una habilidad anterior que reutilizar este turno.');
    }
  }
}

function activateUnitAbility(index, player = 1, fromAI = false) {
  const field = player === 1 ? p1Field : p2Field;
  const unit = field[index];
  if (!unit || !unit.active || unit.used || gameOver) return false;
  if (player === 1 && !canPlay()) return false;
  if (player === 2 && !fromAI && (localMode !== 'pvp' || active !== 2)) return false;

  if (unit.active === 'repeatCombo') {
    const comboUnit = field.find(card => card !== unit && card.combo && card.combo <= 3 && (card.comboBoost || card.comboEffect));
    if (!comboUnit) {
      log('⏳ No hay un efecto Combo 3 o inferior disponible para repetir.');
      return false;
    }
    applyCollisionCombo(comboUnit, player, true);
    log('💥 ' + unit.name + ' repitió el efecto Combo de ' + comboUnit.name + '.');
  } else if (unit.active === 'peek3') {
    const deckRef = player === 1 ? p1Deck : p2Deck;
    const preview = deckRef.slice(-3).reverse().map(card => card.name);
    log('🔭 ' + unit.name + ': ' + (preview.length ? preview.join(', ') : 'el mazo está vacío') + '.');
  } else {
    return false;
  }

  unit.used = true;
  render();
  return true;
}

function cardPowerBonus(c, player = 1) {
  const ownField = player === 1 ? p1Field : p2Field;
  const ownHand = player === 1 ? hand : aiHand;
  const ownGrave = player === 1 ? p1Grave : p2Grave;
  const enemyGrave = player === 1 ? p2Grave : p1Grave;
  const ownShield = player === 1 ? p1shield : p2shield;
  const ownDon = player === 1 ? p1DonReserve : p2DonReserve;
  let n = 0;
  if (c.onPlay === 'beastBonus' && (c.attached || 0) >= 2) n += 300;
  if (c.onPlay === 'kingBonus' && ownField.length >= 1) n += 500;
  if (c.onPlay === 'legendBonus' && ownShield <= 1) n += 700;
  if (c.onPlay === 'legendFieldBonus' && ownField.length >= 2) n += 600;
  if (c.onPlay === 'graveBonus300' && ownGrave.length >= 3) n += 300;
  if (c.onPlay === 'graveBonus500' && ownGrave.length >= 7) n += 500;
  if (c.onPlay === 'handGap500' && ownHand.length < (player === 1 ? aiHand.length : hand.length)) n += 500;
  if (c.onPlay === 'deathBoost700' && (ownGrave.length + enemyGrave.length) > 0) n += 700;
  if (c.onPlay === 'donPower500' && ownDon.length >= 3) n += 500;
  if (c.onPlay === 'awakenedBonus' && ownField.some(x => x.awakened)) n += 200;
  return n;
}

function triggerAwakening(c, player = 1, force = false) {
  if (!c || !c.awakening || c.awakened) return false;
  const info = c.awakening;
  const don = (player === 1 ? p1DonReserve : p2DonReserve).length;
  let ok = force || info.kind === 'self' || (info.kind === 'don' && don >= info.value);
  if (!ok) return false;
  c.awakened = true;
  if (player === 1) awakenedThisTurnP1 = true; else awakenedThisTurnP2 = true;
  log('✨ ' + c.name + ' DESPERTÓ.');
  if (info.boost) c.tempBoost = (c.tempBoost || 0) + info.boost;
  if (info.draw) { for (let i = 0; i < info.draw; i++) player === 1 ? drawP1() : drawP2(); }
  return true;
}

function notifyDefeat(card, ownerPlayer) {
  if (!card) return;
  const ownHand = ownerPlayer === 1 ? hand : aiHand;
  const ownDeck = ownerPlayer === 1 ? p1Deck : p2Deck;
  const ownGrave = ownerPlayer === 1 ? p1Grave : p2Grave;
  const ownField = ownerPlayer === 1 ? p1Field : p2Field;
  const ownLife = ownerPlayer === 1 ? p1hp : p2hp;
  const draw = ownerPlayer === 1 ? drawP1 : drawP2;
  battleStats.unitsDefeated++;

  if (card.onKO === 'draw2') { draw(); draw(); log('💀 ' + card.name + ': robaste 2 cartas.'); }
  else if (card.onKO === 'healshield') {
    if (ownerPlayer === 1 && p1shield < 5) p1shield++;
    if (ownerPlayer === 2 && p2shield < 5) p2shield++;
  }
  else if (card.onKO === 'donRecover') {
    const donDeck = ownerPlayer === 1 ? p1DonDeck : p2DonDeck;
    const donReserve = ownerPlayer === 1 ? p1DonReserve : p2DonReserve;
    if (donDeck.length) donReserve.push(donDeck.pop());
  }
  else if (card.onKO === 'peekTop') {
    if (ownDeck.length) log('🔭 ' + card.name + ': la carta superior es ' + ownDeck[ownDeck.length - 1].name + '.');
  }
  else if (card.onKO === 'recover2') {
    for (let i = 0; i < 2 && ownGrave.length; i++) ownHand.push(ownGrave.pop());
  }
  else if (card.onKO === 'returnSelf' || (card.onKO === 'returnSelfIfAwakened' && card.awakened) || (card.onKO === 'rabbitReturn' && ownLife <= 1)) {
    const index = ownGrave.indexOf(card);
    if (index >= 0) ownHand.push(ownGrave.splice(index, 1)[0]);
  }
  else if (card.onKO === 'rabbitDraw' && ownLife <= 1) draw();
  else if (card.onKO === 'hunterDraw' && ownLife <= 0) draw();

  ownField.forEach(ally => {
    if (ally.onAllyKO) ally.tempBoost = (ally.tempBoost || 0) + ally.onAllyKO;
    if (ally.onAllyKOPermanent) ally.power += ally.onAllyKOPermanent;
  });
  if (ownerPlayer === 1) rollShadows(1, card.name);
  if (ownerPlayer === 2) rollShadows(2, card.name);
}

function rollShadows(player, defeatedName) {
  const used = player === 1 ? shadowUsedP1 : shadowUsedP2;
  if (used || gameOver) return;
  const aiShouldUse = player === 2 && localMode === 'ai' && p2Grave.length > 0 && (p2Grave.length >= 3 || aiHand.length <= 2 || p2Field.length === 0);
  const wants = aiShouldUse || (player !== 2 || localMode !== 'ai') && confirm((player === 1 ? '🌑 PLAYER 1' : '🌑 PLAYER 2') + ' puede activar SOMBRAS DEL INFIERNO porque ' + defeatedName + ' fue derrotado. ¿Lanzar el dado?');
  if (!wants) return;
  if (player === 1) shadowUsedP1 = true; else shadowUsedP2 = true;
  const roll = 1 + Math.floor(Math.random() * 6);
  log('🎲 Sombras del Infierno — ' + (player === 1 ? 'P1' : 'P2') + ' sacó ' + roll + '.');
  if (roll % 2 === 1) { log('🌑 No ocurre nada.'); showShadowStatus(); return; }
  let gr = player === 1 ? p1Grave : p2Grave, hd = player === 1 ? hand : aiHand;
  if (gr.length) {
    let c = gr.pop();
    hd.push(c);
    log('🌑 Sombras del Infierno: ' + c.name + ' vuelve a la mano.');
  }
  showShadowStatus();
  render();
}

function tryRabbitHole(player) {
  if (rabbitHoleUsed) return false;
  const source = player === 1 ? hand : aiHand;
  const ix = source.findIndex(c => c.effect === 'rabbitHole' || c.name === 'Leyendas Inmortales');
  if (ix < 0) return false;
  const card = source.splice(ix, 1)[0];
  rabbitHoleUsed = true;
  log((player === 1 ? '🐇 RABBIT HOLE: ' : '🤖 🐇 RABBIT HOLE: ') + card.name + ' ignoró el ataque final.');
  return true;
}

function checkWin() {
  if (gameOver) return;
  if (p1hp <= 0) {
    gameOver = true;
    log("💀 PLAYER 1 perdió la partida.");
    if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "🏆 P2 ganó.";
    render();
    setTimeout(() => {
      showSoloPostGame({ won: false, winner: 2 });
    }, 700);
  }
  if (p2hp <= 0) {
    gameOver = true;
    packOpenings += 10;
    saveCollection();
    log("🏆 ¡PLAYER 1 GANÓ! +10 aperturas de sobres de recompensa 🎁");
    if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "💀 P2 perdió.";
    render();
    setTimeout(() => {
      showSoloPostGame({ won: true, winner: 1 });
    }, 700);
  }
}

/* ==========================================================================
   INTELIGENCIA ARTIFICIAL Y FLUJO DE TURNOS
   ========================================================================== */
async function aiTurn() {
  if (localMode === "pvp") return;
  const aiPolicy = GLTCG.ai.getDifficulty();
  aiBusy = true;
  try {
  if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "🟡 Robando carta...";
  setAIRealtime("Robando carta...");
  render();
  await delay(900);
  
  drawP2();
  drawDon(2);
  p2don = p2DonReserve.length;
  p2max = Math.min(10, p2max + 1);
  
  p2Field.forEach(GLTCG.rules.resetUnitForTurn);
  
  if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "🟡 Analizando...";
  setAIRealtime("Evaluando jugadas posibles...");
  render();
  await delay(1000);
  
  let choices = aiHand.filter(c => c.cost <= p2DonReserve.length);
  let plays = 0;
  while (choices.length > 0 && plays < aiPolicy.maxPlays) {
    let c = GLTCG.ai.chooseCard(choices, aiPolicy), idx = aiHand.indexOf(c);
    if (idx < 0) break;
    if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "🟠 Invocando " + c.name + "...";
    setAIRealtime("Jugando " + c.name + "...");
    const played = playCardForPlayer(2, idx, true);
    if (!played) break;
    plays++;
    render();
    await delay(800);
    choices = aiHand.filter(c => c.cost <= p2DonReserve.length);
  }

  GLTCG.ai.attachDon(aiPolicy);
  p2Field.forEach((unit, index) => {
    if (unit.active && !unit.used) activateUnitAbility(index, 2, true);
  });
  
  const readyAttackers = p2Field.filter(u => !u.summoningSickness && !u.hasAttacked);
  let attacks = 0;
  for (let attacker of readyAttackers) {
    if (gameOver || attacks >= aiPolicy.maxAttacks) break;
    attacker.hasAttacked = true;
    attacks++;
    addCombo(2, 1);
    if (aiLeader?.id === 'C41' && comboHas(2, 2) && !collisionLeaderUsedP2) {
      attacker.tempBoost = (attacker.tempBoost || 0) + 500;
      collisionLeaderUsedP2 = true;
    }
    
    if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "🔴 Atacando con " + attacker.name + "...";
    setAIRealtime(attacker.name + " está atacando...");
    render();
    await delay(1100);
    
    let power = totalPower(attacker) + (attacker.secondAttackBoost || 0);
    const canAttackLeader = !!attacker.canAttackLeader;
    attacker.secondAttackBoost = 0;
    attacker.canAttackLeader = false;
    
    if (!GLTCG.rules.canAttackLeaderThroughField({ canAttackLeader: canAttackLeader }, p1Field)) {
      let targetIdx = GLTCG.ai.chooseTarget(attacker, aiPolicy);
      let target = p1Field[targetIdx];
      let tPower = totalPower(target);
      
      log('⚔️ IA: ' + attacker.name + ' (' + power + ') ataca a tu ' + target.name + ' (' + tPower + ').');
      
      if (power > tPower) {
        p1Field.splice(targetIdx, 1);
        p1Grave.push(target);
        log("💥 Tu " + target.name + " fue derrotado. " + attacker.name + " sobrevive.");
        notifyDefeat(target, 1);
      } else if (power < tPower) {
        let attIdx = p2Field.indexOf(attacker);
        if (attIdx >= 0) p2Field.splice(attIdx, 1);
        p2Grave.push(attacker);
        log("💥 " + attacker.name + " de la IA fue derrotado.");
        notifyDefeat(attacker, 2);
      } else {
        p1Field.splice(targetIdx, 1);
        p1Grave.push(target);
        let attIdx = p2Field.indexOf(attacker);
        if (attIdx >= 0) p2Field.splice(attIdx, 1);
        p2Grave.push(attacker);
        log("💥 Empate: ambos personajes cayeron en combate.");
        notifyDefeat(target, 1);
        notifyDefeat(attacker, 2);
      }
    } else {
      log("👑 Campo despejado: " + attacker.name + " ataca directamente a tu Líder.");
      if (p1shield > 0) {
        p1shield--;
        log("🛡️ ¡Tu escudo absorbió el golpe! Te quedan " + p1shield + " escudos.");
      } else if (p1hp <= 0 && tryRabbitHole(1)) {
        log("🐇 RABBIT HOLE: Tu Líder estaba en 0 ❤️ y evitó el golpe final.");
      } else {
        p1hp = Math.max(0, p1hp - 1);
        log("💥 ¡Daño directo a tu Líder! Vidas restantes: " + p1hp);
      }
    }
    checkWin();
    render();
    await delay(700);
  }
  
  checkWin();
  if (!gameOver) {
    p1Field.forEach(GLTCG.rules.resetUnitForTurn);
    p2Field.forEach(GLTCG.rules.resetUnitForTurn);
    leaderAbilityUsed = false;
    leaderAbilityUsedP2 = false;
    awakenedThisTurnP1 = false;
    awakenedThisTurnP2 = false;
    comboP2 = 0;
    comboBonusP2 = 0;
    collisionLeaderUsedP2 = false;
    comboP1 = 0;
    comboBonusP1 = 0;
    collisionLeaderUsedP1 = false;
    lastResolvedAbility = null;
    active = 1;
    turn++;
    p1max = Math.min(10, p1max + 1);
    drawP1();
    drawDon(1);
    p1don = p1DonReserve.length;
    if (document.getElementById("aiStatus")) document.getElementById("aiStatus").textContent = "🟢 Esperando";
    log("🔄 Comienza tu turno: robaste 1 carta y 1 DON. Personajes listos.");
  }
  } catch (error) {
    console.error('Error durante el turno de la IA:', error);
    log('⚠️ La IA tuvo un problema y el turno se ha detenido de forma segura.');
  } finally {
    aiBusy = false;
    render();
  }
}

function endTurn() {
  if (gameOver) return;
  emitBattleEvent('END_TURN', { player: active });
  if (localMode === "pvp") {
    if (active === 1) {
      active = 2;
      comboP1 = 0;
      comboBonusP1 = 0;
      collisionLeaderUsedP1 = false;
      lastResolvedAbility = null;
      p2Field.forEach(GLTCG.rules.resetUnitForTurn);
      log("🔄 Turno de PLAYER 2.");
      drawP2();
      drawDon(2);
      p2don = p2DonReserve.length;
      p2max = Math.min(10, p2max + 1);
    } else {
      active = 1;
      comboP2 = 0;
      comboBonusP2 = 0;
      collisionLeaderUsedP2 = false;
      lastResolvedAbility = null;
      p1Field.forEach(GLTCG.rules.resetUnitForTurn);
      log("🔄 Turno de PLAYER 1.");
      drawP1();
      drawDon(1);
      p1don = p1DonReserve.length;
      p1max = Math.min(10, p1max + 1);
    }
    render();
    return;
  }
  if (active !== 1 || aiBusy) return;
  active = 2;
  log("⏭️ Terminaste tu turno.");
  render();
  aiTurn();
}

function drawCard() {
  if (gameOver) return;
  if (localMode === "pvp" && active === 2) {
    drawP2();
    log("🎴 PLAYER 2 robó 1 carta.");
    render();
  } else if (canPlay()) {
    drawP1();
    log("🎴 Robaste 1 carta.");
    render();
  }
}

function reset() {
  const saved = localStorage.getItem('GLTCG_SELECTED_LEADER');
  if (saved) {
    const found = LEADERS.find(l => l.id === saved);
    if (found) selectedLeader = found;
  }
  leaderAbilityUsed = false;
  leaderAbilityUsedP2 = false;
  shadowUsedP1 = false;
  shadowUsedP2 = false;
  awakenedThisTurnP1 = false;
  awakenedThisTurnP2 = false;
  comboP1 = 0; comboP2 = 0; comboBonusP1 = 0; comboBonusP2 = 0;
  collisionLeaderUsedP1 = false; collisionLeaderUsedP2 = false;
  lastResolvedAbility = null;
  resolvingRepeatedAbility = false;
  
  p1Deck = makeDeck();
  p2Deck = makeDeck();
  hand = []; aiHand = []; p1Field = []; p2Field = []; p1Grave = []; p2Grave = [];
  p1DonDeck = makeDonDeck(); p2DonDeck = makeDonDeck();
  p1DonReserve = []; p2DonReserve = [];
  
  p1hp = 5; p2hp = 5; p1shield = 3; p2shield = 3;
  p1max = 3; p2max = 2; p1don = 0; p2don = 0;
  p1leaderDon = 0; p2leaderDon = 0;
  active = 1; turn = 1; gameOver = false; aiBusy = false; boost = 0; p2Boost = 0;
  resetBattleStats();
  battleEventHistory = [];
  emitBattleEvent('GAME_START', { mode: localMode, leader1: selectedLeader.id, leader2: (localMode === 'pvp' ? selectedLeaderP2 : aiLeader).id });
  rabbitHoleUsed = false;
  
  for (let i = 0; i < 5; i++) { drawP1(); drawP2(); }
  for (let i = 0; i < 3; i++) { drawDon(1); drawDon(2); }
  if (document.getElementById("log")) document.getElementById("log").innerHTML = "";
  log("🏴‍☠️ ¡Nueva partida iniciada!");
  render();
}

/* ==========================================================================
   RENDERIZADO DE LA ARENA Y ELEMENTOS VISUALES
   ========================================================================== */
function setText(id, value) {
  const e = document.getElementById(id);
  if (e) e.textContent = value;
}

function renderShields(id, n) {
  let b = document.getElementById(id);
  if (!b) return;
  b.innerHTML = "";
  for (let i = 0; i < n; i++) {
    let s = document.createElement("span");
    s.className = "shield";
    s.textContent = "🛡️";
    b.appendChild(s);
  }
}

function renderDon() {
  let a = document.getElementById("arenaP1DonPool");
  if (a) {
    a.innerHTML = "";
    p1DonReserve.forEach((_, i) => a.appendChild(makeDonToken(i)));
  }
  let b = document.getElementById("arenaP2DonPool");
  if (b) {
    b.innerHTML = "";
    p2DonReserve.forEach(() => {
      let d = document.createElement("div");
      d.className = "doncard";
      d.textContent = "🪙";
      b.appendChild(d);
    });
  }
  const leader = document.getElementById("arenaP1Leader");
  if (leader) setupDropZone(leader, "leader", 0);
}

function renderArena() {
  const vals = {
    p1hpArena: p1hp,
    p2hpArena: p2hp,
    p1shieldArena: p1shield,
    p2shieldArena: p2shield,
    p1donArena: p1DonReserve.length,
    p2donArena: p2DonReserve.length,
    arenaP1Power: 5000 + p1leaderDon * 1000
  };
  for (const [id, v] of Object.entries(vals)) {
    const e = document.getElementById(id);
    if (e) e.textContent = v;
  }
  
  const t = document.getElementById("arenaTurn");
  if (t) t.textContent = gameOver ? "🏁 PARTIDA TERMINADA" : localMode === "pvp" ? (active === 1 ? "⚔️ TURNO DE PLAYER 1" : "⚔️ TURNO DE PLAYER 2") : (active === 1 ? "⚔️ TU TURNO" : "🤖 TURNO DE LA IA");
  const s = document.getElementById("aiStatus");
  if (s) s.textContent = aiBusy ? "🤖 Actuando..." : "Esperando";
  
  const arenaLeader = document.getElementById("arenaP1Leader");
  if (arenaLeader) setupDropZone(arenaLeader, "leader", 0);
  
  const p1 = document.getElementById("arenaP1Field"), p2 = document.getElementById("arenaP2Field");
  
  // RENDER P1 FIELD UNITS
  if (p1) {
    p1.innerHTML = "";
    p1Field.forEach((c, i) => {
      const e = document.createElement("div");
      const isSick = !!c.summoningSickness;
      const isExhausted = !!c.hasAttacked;
      const canAttack = !isSick && !isExhausted && canPlay();
      const hasDon = (c.attached || 0) > 0;
      const abilityReady = !!c.active && !c.used;
      
      e.className = "arena-unit" + (isExhausted ? " exhausted" : "") + (isSick ? " summoning-sick" : "") + (canAttack ? " attack-ready" : "") + (hasDon ? " has-don" : "") + (abilityReady ? " ability-ready" : "");
      e.dataset.donCount = c.attached || 0;
      e.dataset.index = i;
      
      let statusBadge = '';
      if (isSick) statusBadge = '<div class="unit-status-badge status-sick" title="No puede atacar el turno en que entra">⏳ Invocado</div>';
      else if (isExhausted) statusBadge = '<div class="unit-status-badge status-exhausted" title="Ya atacó este turno">💤 Agotado</div>';
      else statusBadge = '<div class="unit-status-badge status-ready" title="Listo para atacar">⚔️ Listo</div>';
      
      e.innerHTML = '<div class="arena-art">' + (c.art || '🃏') + '</div>' +
                    '<h4>' + c.name + '</h4>' +
                    '<div class="arena-power">💥 ' + totalPower(c) + '</div>' +
                    '<div class="arena-dons">🪙 ' + (c.attached || 0) + ' DON' + (c.blocker ? ' · 🛡️' : '') + '</div>' +
                    statusBadge;
                    
      e.onclick = () => (attackSelection !== null && localMode === "pvp" && active === 2) ? chooseArenaCharacter(i) : null;
      setupDropZone(e, "unit", i);
      
      if ((localMode === "pvp" && active === 1) || localMode === "ai") {
        const b = document.createElement("button");
        b.className = "btn-unit-attack" + (canAttack ? "" : " disabled");
        b.textContent = "⚔️ Atacar";
        b.setAttribute('aria-label', 'Atacar con ' + c.name);
        b.disabled = !canAttack;
        b.onclick = ev => {
          ev.stopPropagation();
          chooseArenaAttack(i);
        };
        e.appendChild(b);
      }
      if (c.active && !c.used && ((localMode === "pvp" && active === 1) || localMode === "ai")) {
        const abilityButton = document.createElement("button");
        abilityButton.className = "btn-unit-ability";
        abilityButton.textContent = "✨ Activar";
        abilityButton.setAttribute('aria-label', 'Activar habilidad de ' + c.name);
        abilityButton.onclick = ev => {
          ev.stopPropagation();
          activateUnitAbility(i, 1);
        };
        e.appendChild(abilityButton);
      }
      p1.appendChild(e);
    });
  }
  
  // RENDER P2 FIELD UNITS
  if (p2) {
    p2.innerHTML = "";
    p2Field.forEach((c, i) => {
      const e = document.createElement("div");
      const isSick = !!c.summoningSickness;
      const isExhausted = !!c.hasAttacked;
      const canAttack = !isSick && !isExhausted && localMode === "pvp" && active === 2 && !gameOver;
      const hasDon = (c.attached || 0) > 0;
      const abilityReady = !!c.active && !c.used;
      
      e.className = "arena-unit enemy" + (isExhausted ? " exhausted" : "") + (isSick ? " summoning-sick" : "") + (canAttack ? " attack-ready" : "") + (hasDon ? " has-don" : "") + (abilityReady ? " ability-ready" : "");
      e.dataset.donCount = c.attached || 0;
      e.dataset.index = i;
      
      let statusBadge = '';
      if (isSick) statusBadge = '<div class="unit-status-badge status-sick">⏳ Invocado</div>';
      else if (isExhausted) statusBadge = '<div class="unit-status-badge status-exhausted">💤 Agotado</div>';
      else statusBadge = '<div class="unit-status-badge status-ready">⚔️ Listo</div>';
      
      e.innerHTML = '<div class="arena-art">' + (c.art || '🃏') + '</div>' +
                    '<h4>' + c.name + '</h4>' +
                    '<div class="arena-power">💥 ' + totalPower(c) + '</div>' +
                    '<div class="arena-dons">🪙 ' + (c.attached || 0) + ' DON' + (c.blocker ? ' · 🛡️' : '') + '</div>' +
                    statusBadge;
                    
      e.onclick = () => {
        if (localMode === "pvp" && p2AttackSelection !== null) chooseArenaCharacter(i);
        else if (attackSelection !== null) chooseArenaCharacter(i);
      };
      
      if (localMode === "pvp" && active === 2) {
        const b = document.createElement("button");
        b.className = "btn-unit-attack" + (canAttack ? "" : " disabled");
        b.textContent = "⚔️ Atacar";
        b.setAttribute('aria-label', 'Atacar con ' + c.name);
        b.disabled = !canAttack;
        b.onclick = ev => {
          ev.stopPropagation();
          chooseArenaAttackP2(i);
        };
        e.appendChild(b);
        if (c.active && !c.used) {
          const abilityButton = document.createElement("button");
          abilityButton.className = "btn-unit-ability";
          abilityButton.textContent = "✨ Activar";
          abilityButton.setAttribute('aria-label', 'Activar habilidad de ' + c.name);
          abilityButton.onclick = ev => {
            ev.stopPropagation();
            activateUnitAbility(i, 2);
          };
          e.appendChild(abilityButton);
        }
      }
      p2.appendChild(e);
    });
  }
  
  // RENDER PLAYER HAND
  const h = document.getElementById("arenaHand");
  if (h) {
    h.innerHTML = "";
    const source = (localMode === "pvp" && active === 2) ? aiHand : hand;
    const who = (localMode === "pvp" && active === 2) ? "PLAYER 2" : "PLAYER 1";
    const lab = document.getElementById("activeHandLabel");
    if (lab) lab.textContent = gameOver ? "" : ("🃏 Mano de " + who);
    source.forEach((c, i) => {
      const e = document.createElement("div");
      const canAfford = (c.cost || 0) <= (localMode === "pvp" && active === 2 ? p2DonReserve.length : p1DonReserve.length);
      const cardPlayable = canPlay() && canAfford;
      e.className = "card " + rarityClass(c.rarity) + (cardPlayable ? " card-playable" : " card-unavailable");
      e.setAttribute('aria-label', c.name + (cardPlayable ? ', carta jugable' : ', carta no disponible'));
      const rarityBadge = c.rarity ? '<span class="badge ' + rarityClass(c.rarity) + '">' + c.rarity + '</span>' : '';
      const typeBadge = c.type ? '<span class="badge badge-cyan">' + c.type + '</span>' : '';
      const abilityDesc = c.ability || c.description || (c.type === 'Personaje' ? 'Sin habilidad especial' : 'Efecto al jugar');
      
      e.innerHTML = '<div class="art">' + (c.art || '🃏') + '</div>' +
                    '<h3>' + c.name + '</h3>' +
                    '<div class="card-stats">⚡ Coste ' + c.cost + ' · 💥 Poder ' + c.power + '</div>' +
                    '<div class="card-badges">' + typeBadge + ' ' + rarityBadge + '</div>' +
                    '<div class="ability">' + abilityDesc + '</div>' +
                    '<button type="button" class="btn-play-card" aria-label="Jugar ' + c.name + '">🃏 JUGAR</button>';
                    
      e.querySelector("button").onclick = (ev) => {
        ev.stopPropagation();
        localMode === "pvp" && active === 2 ? playCardP2(i) : playCard(i);
      };
      e.onclick = () => {
        localMode === "pvp" && active === 2 ? playCardP2(i) : playCard(i);
      };
      h.appendChild(e);
    });
  }
}

function render() {
  setText('arenaP1LeaderName', selectedLeader.name);
  setText('arenaP1LeaderAbility', selectedLeader.ability);
  setText('arenaP2LeaderName', (localMode === "pvp" && selectedLeaderP2) ? selectedLeaderP2.name : aiLeader.name);
  setText('arenaP2LeaderAbility', (localMode === "pvp" && selectedLeaderP2) ? selectedLeaderP2.ability : aiLeader.ability);
  setText('arenaP1LeaderArt', selectedLeader.art);
  setText('arenaP2LeaderArt', (localMode === "pvp" && selectedLeaderP2) ? selectedLeaderP2.art : aiLeader.art);
  
  setText("p1hp", p1hp);
  setText("p2hp", p2hp);
  setText("p1shield", p1shield);
  setText("p2shield", p2shield);
  setText("p1don", p1DonReserve.length);
  setText("p2don", p2DonReserve.length);
  setText("p1max", p1max);
  setText("p2max", p2max);
  setText("p1hand", hand.length);
  setText("p2hand", aiHand.length);
  
  const p2t = document.getElementById("p2Title");
  if (p2t) p2t.textContent = localMode === "pvp" ? "👥 PLAYER 2 — LOCAL" : "🤖 PLAYER 2 — IA";
  
  setText("p1grave", p1Grave.length);
  setText("p2grave", p2Grave.length);
  showComboStatus();
  showShadowStatus();
  
  setText("pStatus", localMode === "pvp" ? (active === 1 ? "🟢 Turno de PLAYER 1" : "🔴 Turno de PLAYER 2") : (active === 1 ? "🟢 Puedes jugar" : "🔴 Esperando a la IA"));
  
  const db = document.getElementById("drawBtn"), eb = document.getElementById("endBtn");
  if (db) db.disabled = !canPlay();
  if (eb) eb.disabled = !canPlay();
  
  renderDon();
  renderArena();
  validateGameState();
}


/* ==========================================================================
   SISTEMA DE RESUMEN POST-PARTIDA ESTILO SOLO LEVELING (NOTIFICACIÓN DEL SISTEMA)
   ========================================================================== */
function animateSoloCounter(elementId, targetValue, duration = 1000) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = 0;
  const target = Math.max(0, Number(targetValue) || 0);
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    el.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

function showSoloPostGame(result) {
  const modal = document.getElementById("soloPostGameModal");
  if (!modal) return;
  
  const won = !!result.won;
  battleStats.turns = Math.max(battleStats.turns, turn);
  
  // 1. Determinar Rango de Cazador
  let rank = 'C';
  let rankClass = 'rank-c';
  let rankDesc = 'RANGO CAZADOR';
  
  if (won) {
    if (p1hp >= 4 && battleStats.turns <= 7) {
      rank = 'S';
      rankClass = 'rank-s';
      rankDesc = 'GRAN LEYENDA';
    } else if (p1hp >= 3) {
      rank = 'A';
      rankClass = 'rank-a';
      rankDesc = 'DUELISTA MAESTRO';
    } else if (p1hp >= 2) {
      rank = 'B';
      rankClass = 'rank-b';
      rankDesc = 'DUELISTA ÉLITE';
    } else {
      rank = 'C';
      rankClass = 'rank-c';
      rankDesc = 'DUELISTA VETERANO';
    }
  } else {
    rank = 'E';
    rankClass = 'rank-e';
    rankDesc = 'DUELISTA APRENDIZ';
  }
  
  // 2. Banner de Resultado
  const banner = document.getElementById("soloResultBanner");
  const icon = document.getElementById("soloBannerIcon");
  const title = document.getElementById("soloResultTitle");
  const subtitle = document.getElementById("soloResultSubtitle");
  
  if (banner) {
    banner.className = "solo-result-banner" + (won ? "" : " defeat");
  }
  if (icon) icon.textContent = won ? "🏆" : "💀";
  if (title) title.textContent = won ? "¡VICTORIA EN EL DUELO!" : "DERROTA EN EL DUELO";
  if (subtitle) {
    subtitle.textContent = won
      ? "Has dominado el campo de batalla con tu mazo y estrategia"
      : "Tus defensas han caído. Ajusta tu mazo y vuelve a desafiar a tu rival.";
  }
  
  // 3. Badge de Rango con animación de estampa
  const badge = document.getElementById("soloRankBadge");
  const rankLetter = document.getElementById("soloRankLetter");
  const rankDescEl = document.getElementById("soloRankDesc");
  
  if (badge) {
    badge.className = "solo-rank-badge " + rankClass;
    badge.style.animation = "none";
    badge.offsetHeight; // Forzar reflow para reiniciar animación
    badge.style.animation = "";
  }
  if (rankLetter) rankLetter.textContent = rank;
  if (rankDescEl) rankDescEl.textContent = rankDesc;
  
  // 4. Calcular y Actualizar EXP, Nivel y Recompensas del Perfil
  const gainedExp = won ? (rank === 'S' ? 650 : rank === 'A' ? 500 : 400) : 150;
  const packsGained = won ? 10 : 2;
  const goldGained = won ? (rank === 'S' ? 800 : 500) : 100;
  
  let currentLevel = 1;
  let totalExp = 0;
  let hasLeveledUp = false;
  
  const k = currentUser();
  if (k) {
    const all = getAccounts();
    const u = all[k];
    if (u) {
      if (won) u.wins = (u.wins || 0) + 1;
      else u.losses = (u.losses || 0) + 1;
      
      const oldLevel = Number(u.level || 1);
      u.exp = (u.exp || 0) + gainedExp;
      totalExp = u.exp;
      const newLevel = Math.max(1, Math.floor(totalExp / 500) + 1);
      if (newLevel > oldLevel) {
        hasLeveledUp = true;
        u.level = newLevel;
      }
      currentLevel = u.level;
      u.packOpenings = (u.packOpenings || 0) + packsGained;
      saveAccounts(all);
    }
  } else {
    // Modo invitado / sin usuario registrado
    currentLevel = 1;
    totalExp = gainedExp;
  }
  
  // Guardar apertura de sobres
  packOpenings += packsGained;
  saveCollection();
  
  // 5. Renderizar Recompensas
  const lvlEl = document.getElementById("soloHunterLevel");
  const expEl = document.getElementById("soloExpGained");
  const barEl = document.getElementById("soloExpBarFill");
  const lvlUpAlert = document.getElementById("soloLevelUpAlert");
  
  if (lvlEl) lvlEl.textContent = "👑 Duelista Nivel " + currentLevel;
  if (expEl) expEl.textContent = "+" + gainedExp + " EXP";
  if (lvlUpAlert) lvlUpAlert.style.display = hasLeveledUp ? "block" : "none";
  
  if (barEl) {
    barEl.style.width = "0%";
    const expInCurrentLevel = (totalExp % 500);
    const expPct = Math.min(100, Math.max(10, Math.round((expInCurrentLevel / 500) * 100)));
    setTimeout(() => {
      barEl.style.width = expPct + "%";
    }, 200);
  }
  
  const lootPacksEl = document.getElementById("soloLootPacks");
  const lootGoldEl = document.getElementById("soloLootGold");
  if (lootPacksEl) lootPacksEl.textContent = "+" + packsGained + " Sobres";
  if (lootGoldEl) lootGoldEl.textContent = "+" + goldGained + " Monedas de Oro";
  
  // 6. Animar Contadores de Estadísticas
  animateSoloCounter("soloStatDamage", battleStats.damageDealt, 900);
  animateSoloCounter("soloStatKills", battleStats.unitsDefeated, 700);
  animateSoloCounter("soloStatDon", battleStats.donAttached, 700);
  animateSoloCounter("soloStatTurns", battleStats.turns, 600);
  
  // 7. Abrir Modal
  modal.classList.add("open");
}

function closeSoloPostGame() {
  const modal = document.getElementById("soloPostGameModal");
  if (modal) modal.classList.remove("open");
}

function claimSoloRewardsAndOpenPacks() {
  closeSoloPostGame();
  hideGame();
  openMainMenu();
  openPack();
}

function retrySoloBattle() {
  closeSoloPostGame();
  reset();
}

function exitSoloToMenu() {
  closeSoloPostGame();
  openMainMenu();
}

/* ==========================================================================
   EVENT LISTENERS Y ATADURAS GLOBALES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const drawBtn = document.getElementById("drawBtn");
  const endBtn = document.getElementById("endBtn");
  const resetBtn = document.getElementById("resetBtn");
  
  if (drawBtn) drawBtn.onclick = drawCard;
  if (endBtn) endBtn.onclick = endTurn;
  if (resetBtn) resetBtn.onclick = reset;
  
  saveCollection();
  hideGame();
});

// Tecla Escape para retroceso universal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const deckModal = document.getElementById('deckModal');
    if (deckModal && deckModal.classList.contains('open')) {
      handleDeckBuilderBack();
      return;
    }
    const packModal = document.getElementById('packModal');
    if (packModal && packModal.classList.contains('open')) {
      closePack();
      openMainMenu();
      return;
    }
    const setsModal = document.getElementById('setsModal');
    if (setsModal && setsModal.classList.contains('open')) {
      closeSets();
      return;
    }
    const leaderModal = document.getElementById('leaderModal');
    if (leaderModal && leaderModal.classList.contains('open')) {
      closeLeaderModal();
      return;
    }
    const localModal = document.getElementById('localModeModal');
    if (localModal && localModal.classList.contains('open')) {
      closeLocalMode();
      openMainMenu();
      return;
    }
    const hubModal = document.getElementById('playerHubModal');
    if (hubModal && hubModal.classList.contains('open')) {
      closePlayerHub();
      return;
    }
  }
});
