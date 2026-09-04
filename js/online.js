/* Grand Legends TCG - Módulo Online Hub Integration */
function openOnline() {
  if (typeof openPlayerHub === 'function') {
    openPlayerHub('online');
  }
}
function closeOnline() {
  if (typeof closePlayerHub === 'function') {
    closePlayerHub();
  }
}
function createRoom() {
  if (typeof createHubRoom === 'function') {
    createHubRoom();
  }
}
function joinRoom() {
  if (typeof joinHubRoom === 'function') {
    joinHubRoom();
  }
}
function showJoinRoom() {
  if (typeof openPlayerHub === 'function') {
    openPlayerHub('online');
  }
}
function startOnlineMatch() {
  if (typeof startHubOnlineMatch === 'function') {
    startHubOnlineMatch();
  }
}
function setServerUrl() {
  if (typeof saveHubServerUrl === 'function') {
    saveHubServerUrl();
  }
  return true;
}
function copyRoomCode() {
  if (typeof copyHubRoomCode === 'function') {
    copyHubRoomCode();
  }
  return true;
}
