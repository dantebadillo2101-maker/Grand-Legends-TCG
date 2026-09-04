// Grand Legends TCG - Politicas de dificultad de la IA
window.GLTCG = window.GLTCG || {};

const AI_DIFFICULTIES = {
	baja: { label: 'Baja', maxPlays: 1, maxAttacks: 1, attachDon: 0, random: true },
	normal: { label: 'Normal', maxPlays: 2, maxAttacks: Infinity, attachDon: 1, random: false },
	dificil: { label: 'Dificil', maxPlays: Infinity, maxAttacks: Infinity, attachDon: 2, random: false }
};

let aiDifficulty = localStorage.getItem('GLTCG_AI_DIFFICULTY') || 'normal';
if (!AI_DIFFICULTIES[aiDifficulty]) aiDifficulty = 'normal';

function setAIDifficulty(value) {
	if (!AI_DIFFICULTIES[value]) return;
	aiDifficulty = value;
	localStorage.setItem('GLTCG_AI_DIFFICULTY', value);
	const select = document.getElementById('aiDifficulty');
	if (select) select.value = value;
}

window.addEventListener('DOMContentLoaded', () => {
	const select = document.getElementById('aiDifficulty');
	if (select) select.value = aiDifficulty;
});

function getAIDifficultyConfig() {
	return AI_DIFFICULTIES[aiDifficulty] || AI_DIFFICULTIES.normal;
}

function scoreAICard(card, config) {
	if (config.random) return Math.random();

	let score = card.power || 0;
	if (card.type === 'Personaje') score += 1000;
	if (card.blocker && p1Field.length) score += 900;
	if (card.effect === 'ko1500' && p1Field.some(c => totalPower(c) <= 1500)) score += 2200;
	if (card.effect === 'break2') score += p2shield > 0 ? 1800 : 200;
	if (card.effect === 'bounce1000' && p1Field.some(c => totalPower(c) <= 1000)) score += 1500;
	if (card.effect === 'debuff700' && p1Field.length) score += 900;
	if (card.effect === 'draw' || card.effect === 'draw1' || card.effect === 'draw2') score += 500;
	if (card.effect === 'healshield' && p2shield < 3) score += 1200;
	if (card.effect === 'draw3Discard' || card.effect === 'legendCore') score += 900;
	if (card.effect === 'comboPlus1' || card.effect === 'comboPlus2' || card.effect === 'comboPlus3') score += 700;
	if (card.effect === 'koCollision' && p1Field.some(c => totalPower(c) <= (comboValue(2) >= 5 ? 2500 : 1800))) score += 2200;
	if (card.effect === 'stormCollision' && p1Field.length >= 2) score += 1800;
	if (card.effect === 'collisionBoostLeader' && p2Field.length) score += 1100;
	if (card.active === 'repeatCombo' && p2Field.some(c => c.combo && c.combo <= 3)) score += 750;
	if (card.awakening) score += 300;
	if (card.onPlay) score += 250;
	return score;
}

function chooseAICard(cards, config) {
	if (!cards.length) return null;
	if (config.random) return cards[Math.floor(Math.random() * cards.length)];
	return cards.slice().sort((a, b) => scoreAICard(b, config) - scoreAICard(a, config))[0];
}

function chooseAITarget(attacker, config) {
	if (!p1Field.length) return -1;
	const targets = p1Field.map((card, index) => ({ card, index, power: totalPower(card) }));
	const winning = targets.filter(target => totalPower(attacker) > target.power);
	if (config.random) return targets[Math.floor(Math.random() * targets.length)].index;
	const candidates = winning.length ? winning : targets;
	return candidates.sort((a, b) => {
		const aThreat = (a.card.blocker ? 500 : 0) + (a.card.power > 2000 ? 250 : 0);
		const bThreat = (b.card.blocker ? 500 : 0) + (b.card.power > 2000 ? 250 : 0);
		return bThreat - aThreat || a.power - b.power;
	})[0].index;
}

function attachAIDon(config) {
	if (config.attachDon <= 0 || !p2DonReserve.length || !p2Field.length) return;
	const target = p2Field.slice().sort((a, b) => totalPower(b) - totalPower(a))[0];
	const amount = Math.min(config.attachDon, p2DonReserve.length);
	p2DonReserve.splice(0, amount);
	target.attached = (target.attached || 0) + amount;
	p2don = p2DonReserve.length;
	log('🤖 La IA adjuntó ' + amount + ' DON a ' + target.name + '.');
}

GLTCG.ai = {
	difficulties: AI_DIFFICULTIES,
	getDifficulty: getAIDifficultyConfig,
	chooseCard: chooseAICard,
	chooseTarget: chooseAITarget,
	attachDon: attachAIDon
};
