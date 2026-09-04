"use strict";

const root = typeof window !== "undefined" ? window : globalThis;
root.GLTCG = root.GLTCG || {};

function validateCardData(card, knownIds) {
  const errors = [];
  if (!card || typeof card !== "object") return { valid: false, errors: ["La carta no es un objeto valido."] };
  if (!card.id || typeof card.id !== "string") errors.push("Falta un id valido.");
  if (!card.name || typeof card.name !== "string") errors.push("Falta un nombre valido.");
  if (!Number.isInteger(card.cost) || card.cost < 0) errors.push("El coste debe ser un entero no negativo.");
  if (!Number.isFinite(card.power) || card.power < 0) errors.push("El poder debe ser un numero no negativo.");
  if (!["Personaje", "Evento", "Recurso"].includes(card.type)) errors.push("El tipo de carta no es valido.");
  if (knownIds && !knownIds.has(card.id)) errors.push("La carta no pertenece al catalogo.");
  return { valid: errors.length === 0, errors };
}

function validateDeckData(deckCards, library) {
  const errors = [];
  const knownIds = new Set((library || []).map(card => card.id));
  const counts = new Map();
  if (!Array.isArray(deckCards)) return { valid: false, errors: ["El mazo no es una lista valida."] };
  if (deckCards.length !== 40) errors.push("El mazo debe tener exactamente 40 cartas.");
  deckCards.forEach(card => {
    const result = validateCardData(card, knownIds);
    if (!result.valid) errors.push(card && card.id ? card.id + ": " + result.errors.join(" ") : "Carta desconocida.");
    const key = card && (card.id || card.name);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  counts.forEach((count, key) => {
    if (count > 4) errors.push("La carta " + key + " supera el maximo de 4 copias.");
  });
  return { valid: errors.length === 0, errors };
}

function canAttackLeaderThroughField(unit, defenders) {
  return !!unit && unit.canAttackLeader === true || !defenders || defenders.length === 0;
}

function createUnitState(card, temporaryPower = 0) {
  return {
    attached: 0,
    tempBoost: temporaryPower,
    used: false,
    summoningSickness: true,
    hasAttacked: false,
    basePower: card.power,
    awakened: false,
    canAttackLeader: false,
    secondAttackBoost: 0
  };
}

function resetUnitForTurn(unit) {
  if (!unit) return;
  unit.tempBoost = 0;
  unit.used = false;
  unit.summoningSickness = false;
  unit.hasAttacked = false;
  unit.canAttackLeader = false;
  unit.secondAttackBoost = 0;
}

const rules = { validateCardData, validateDeckData, canAttackLeaderThroughField, createUnitState, resetUnitForTurn };
root.GLTCG.rules = rules;

if (typeof module !== "undefined" && module.exports) module.exports = rules;
