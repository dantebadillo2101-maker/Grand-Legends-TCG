"use strict";

const assert = require("assert");
const rules = require("../js/rules.js");

const card = { id: "T001", name: "Carta de prueba", cost: 1, power: 500, type: "Personaje" };
const library = [card];

assert.strictEqual(rules.validateCardData(card, new Set(["T001"])).valid, true);
assert.strictEqual(rules.validateCardData({ ...card, cost: -1 }, new Set(["T001"])).valid, false);
assert.strictEqual(rules.validateDeckData(Array.from({ length: 40 }, () => ({ ...card })), library).valid, false);
assert.strictEqual(rules.validateDeckData(Array.from({ length: 40 }, (_, index) => ({ ...card, id: "T" + String(index).padStart(3, "0") })), library).valid, false);
assert.strictEqual(rules.canAttackLeaderThroughField({ canAttackLeader: true }, [card]), true);
assert.strictEqual(rules.canAttackLeaderThroughField({}, []), true);
assert.strictEqual(rules.canAttackLeaderThroughField({}, [card]), false);

const unit = { ...card, ...rules.createUnitState(card, 700), hasAttacked: true, canAttackLeader: true };
rules.resetUnitForTurn(unit);
assert.strictEqual(unit.tempBoost, 0);
assert.strictEqual(unit.hasAttacked, false);
assert.strictEqual(unit.canAttackLeader, false);
assert.strictEqual(unit.summoningSickness, false);

console.log("rules.test.js: OK");
