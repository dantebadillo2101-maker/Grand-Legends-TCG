/* Grand Legends TCG - Módulo Cuentas y Autenticación */
window.GLTCG = window.GLTCG || {};
GLTCG.account = { token: localStorage.getItem('GLTCG_AUTH_TOKEN') || '', user: null };

function accountApi(path, options = {}) {
  const h = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (GLTCG.account.token) h.Authorization = 'Bearer ' + GLTCG.account.token;
  const base = typeof getConfiguredServerBase === 'function' ? getConfiguredServerBase() : ((location.protocol === 'file:') ? 'http://localhost:3000' : location.origin);
  return fetch(base + path, Object.assign({}, options, { headers: h })).then(async r => {
    const d = await r.json().catch(() => ({ message: 'Respuesta inválida.' }));
    if (!r.ok) throw new Error(d.message || 'Error del servidor');
    return d;
  });
}

function openAccount() {
  if (typeof openPlayerHub === 'function') {
    openPlayerHub('account');
  }
}

function closeAccount() {
  if (typeof closePlayerHub === 'function') {
    closePlayerHub();
  }
}

function openProfile() {
  if (typeof openPlayerHub === 'function') {
    openPlayerHub('profile');
  }
}

function closeProfile() {
  if (typeof closePlayerHub === 'function') {
    closePlayerHub();
  }
}

async function loadAccount() {
  if (!GLTCG.account.token) return;
  try {
    const d = await accountApi('/api/me');
    GLTCG.account.user = d.user;
  } catch {
    GLTCG.account.token = '';
    localStorage.removeItem('GLTCG_AUTH_TOKEN');
  }
}

window.addEventListener('DOMContentLoaded', loadAccount);
