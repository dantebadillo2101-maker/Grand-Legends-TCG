// Grand Legends TCG — SET 01: ORIGINS
// Catálogo oficial de cartas. Este archivo es leído por game.js.
window.GLTCG=window.GLTCG||{};

const SET_01_LEADERS=[
 {id:'L01',name:'Kael, Capitán del Amanecer',art:'🌅',color:'Rojo',life:5,ability:'Una vez por turno: cuando uno de tus personajes ataque, puedes darle +500 poder este combate.'},
 {id:'L02',name:'Lyra, Guardiana Astral',art:'🌌',color:'Azul',life:5,ability:'Una vez por turno: cuando juegues un Evento, roba 1 carta.'},
 {id:'L03',name:'Draven, Señor de las Bestias',art:'🐺',color:'Verde',life:5,ability:'Tus personajes con 2 o más DON ganan +300 poder.'}
];

const SET_01_CARDS=[
{id:'C001',name:'Aprendiz del Alba',cost:1,power:500,type:'Personaje',art:'🌄',ability:'Al entrar: roba 1 carta.',onPlay:'draw',rarity:'Común',traits:['Amanecer']},
{id:'C002',name:'Exploradora Celeste',cost:2,power:700,type:'Personaje',art:'🔭',ability:'Al entrar: mira las 2 primeras cartas de tu mazo y coloca 1 en tu mano.',onPlay:'peek2',rarity:'Común',traits:['Astral']},
{id:'C003',name:'Guardia del Bastión',cost:2,power:900,type:'Personaje',art:'🛡️',ability:'🛡️ BLOCKER.',blocker:true,rarity:'Común',traits:['Bastión']},
{id:'C004',name:'Lobo de Bronce',cost:2,power:1000,type:'Personaje',art:'🐺',ability:'Si tiene 2+ DON, gana +300 poder.',onPlay:'beastBonus',rarity:'Común',traits:['Bestia']},
{id:'C005',name:'Místico de la Aurora',cost:3,power:1100,type:'Personaje',art:'🔮',ability:'Al entrar: recupera 1 escudo si tienes 2 o menos.',onPlay:'healshield',rarity:'Rara',traits:['Amanecer']},
{id:'C006',name:'Titán de Granito',cost:4,power:1900,type:'Personaje',art:'🗿',ability:'🛡️ BLOCKER. No puede atacar el turno en que entra.',blocker:true,rarity:'Rara',traits:['Bastión']},
{id:'C007',name:'Fénix de Cristal',cost:5,power:2200,type:'Personaje',art:'🔥',ability:'💀 Último Aliento: roba 2 cartas.',onKO:'draw2',rarity:'Súper Rara',traits:['Bestia']},
{id:'C008',name:'Rey de las Montañas',cost:5,power:2600,type:'Personaje',art:'👑',ability:'Si controlas otro personaje, gana +500 poder.',onPlay:'kingBonus',rarity:'Ultra Rara',traits:['Bestia']},
{id:'C009',name:'Mensajera del Viento',cost:1,power:400,type:'Personaje',art:'🕊️',ability:'Al entrar: roba 1 y luego descarta 1.',onPlay:'drawDiscard',rarity:'Común',traits:['Viento']},
{id:'C010',name:'Ingeniero de Runas',cost:3,power:900,type:'Personaje',art:'⚙️',ability:'Una vez por turno: paga 1 DON → otro personaje gana +500 este turno.',active:'boostOther',rarity:'Rara',traits:['Runa']},

{id:'C011',name:'Golpe del Amanecer',cost:1,power:0,type:'Evento',art:'☀️',ability:'Un personaje tuyo gana +700 poder este turno.',effect:'boost700',rarity:'Común'},
{id:'C012',name:'Prisión Astral',cost:2,power:0,type:'Evento',art:'⛓️',ability:'Un personaje enemigo pierde 700 poder este turno.',effect:'debuff700',rarity:'Común'},
{id:'C013',name:'Tormenta de Meteoros',cost:3,power:0,type:'Evento',art:'☄️',ability:'Rompe hasta 2 escudos enemigos.',effect:'break2',rarity:'Rara'},
{id:'C014',name:'Renacer del Fénix',cost:4,power:0,type:'Evento',art:'🪽',ability:'Devuelve un personaje de tu cementerio a tu mano.',effect:'recover',rarity:'Súper Rara'},
{id:'C015',name:'Juicio de los Cielos',cost:5,power:0,type:'Evento',art:'⚡',ability:'Derrota un personaje enemigo de 1500 poder o menos.',effect:'ko1500',rarity:'Ultra Rara'},
{id:'C016',name:'Paso Relámpago',cost:2,power:0,type:'Evento',art:'💨',ability:'Un personaje tuyo puede atacar este turno aunque haya entrado este turno.',effect:'ready',rarity:'Rara'},
{id:'C017',name:'Marea Inversa',cost:2,power:0,type:'Evento',art:'🌊',ability:'Devuelve a la mano un personaje enemigo de 1000 poder o menos.',effect:'bounce1000',rarity:'Rara'},
{id:'C018',name:'Escudo del Reino',cost:1,power:0,type:'Evento',art:'🏰',ability:'Previene el próximo daño a tu Líder este turno.',effect:'prevent',rarity:'Común'},

{id:'C019',name:'Fragmento de Estrella',cost:1,power:0,type:'Recurso',art:'⭐',ability:'Roba 1 carta.',effect:'draw1',rarity:'Común'},
{id:'C020',name:'Mapa de los Antiguos',cost:2,power:0,type:'Recurso',art:'🗺️',ability:'Roba 2 cartas y descarta 1.',effect:'draw2Discard',rarity:'Rara'},
{id:'C021',name:'Núcleo de Energía',cost:2,power:0,type:'Recurso',art:'🔋',ability:'Tu próximo personaje gana +700 poder.',effect:'charge',rarity:'Rara'},
{id:'C022',name:'Tesoro de la Primera Era',cost:4,power:0,type:'Recurso',art:'💎',ability:'Roba 3 cartas.',effect:'draw3',rarity:'Súper Rara'},
{id:'C023',name:'Bandera de la Leyenda',cost:3,power:0,type:'Recurso',art:'🚩',ability:'Hasta el final del turno, todos tus personajes ganan +300 poder.',effect:'team300',rarity:'Súper Rara'},
{id:'C024',name:'DON! Resonancia',cost:1,power:0,type:'Recurso',art:'🪙',ability:'Recupera 1 DON usado a tu reserva.',effect:'donRecover',rarity:'Ultra Rara'},

{id:'C025',name:'Heraldo del Trueno',cost:3,power:1300,type:'Personaje',art:'🌩️',ability:'Al atacar: +500 poder este combate.',attackBoost:500,rarity:'Común',traits:['Trueno']},
{id:'C026',name:'Bestia del Valle',cost:3,power:1400,type:'Personaje',art:'🦬',ability:'💀 Último Aliento: recupera 1 escudo.',onKO:'healshield',rarity:'Rara',traits:['Bestia']},
{id:'C027',name:'Arquera Astral',cost:2,power:800,type:'Personaje',art:'🏹',ability:'Al entrar: un enemigo pierde 300 poder este turno.',onPlay:'debuff300',rarity:'Común',traits:['Astral']},
{id:'C028',name:'Caballero del Eclipse',cost:4,power:1800,type:'Personaje',art:'🌘',ability:'🔥 Leyenda: si tienes 1 escudo o menos, gana +700 poder.',onPlay:'legendBonus',rarity:'Súper Rara',traits:['Eclipse']},
{id:'C029',name:'Oráculo del Tiempo',cost:4,power:1200,type:'Personaje',art:'⌛',ability:'Al entrar: roba 2 cartas; puedes conservar ambas.',onPlay:'draw2',rarity:'Súper Rara',traits:['Astral']},
{id:'C030',name:'Coloso de la Primera Era',cost:6,power:3000,type:'Personaje',art:'🌋',ability:'🔥 Leyenda: si controlas 2+ personajes, gana +600 poder.',onPlay:'legendFieldBonus',rarity:'Ultra Rara',traits:['Primera Era']}
];

// ==================== SET 02: AWAKENING ====================
const SET_02_LEADERS=[
 {id:'A01',name:'Aeron, Heraldo del Despertar',art:'✨',color:'Rojo',life:5,ability:'Una vez por turno: cuando uno de tus personajes despierte, puedes darle +500 poder este turno.'},
 {id:'A02',name:'Selene, Oráculo del Vacío',art:'🔮',color:'Azul',life:5,ability:'Una vez por turno: cuando actives un Despertar, mira las 2 primeras cartas de tu mazo y reordénalas.'},
 {id:'A03',name:'Ragnar, Rey de la Llama',art:'🔥',color:'Verde',life:5,ability:'Tus personajes Despertados con 2 o más DON ganan +300 poder.'},
 {id:'A04',name:'Nyx, Soberana del Eclipse',art:'🌑',color:'Púrpura',life:5,ability:'Una vez por turno: cuando uno de tus personajes sea derrotado, recupera 1 DON usado.'}
];
const SET_02_CARDS=[
{id:'A05',name:'Aprendiz del Despertar',cost:1,power:500,type:'Personaje',art:'🌱',ability:'Despertar: con 3+ DON, gana +300 poder este turno.',awakening:{kind:'don',value:3,boost:300},rarity:'Común',traits:['Despertar']},
{id:'A06',name:'Explorador del Umbral',cost:2,power:700,type:'Personaje',art:'🚪',ability:'Al entrar: mira las 2 primeras cartas de tu mazo y añade 1 a tu mano.',onPlay:'peek2',rarity:'Común',traits:['Umbral']},
{id:'A07',name:'Guardia de la Aurora',cost:2,power:900,type:'Personaje',art:'🛡️',ability:'🛡️ BLOCKER.',blocker:true,rarity:'Común',traits:['Aurora']},
{id:'A08',name:'Lobo Despertado',cost:2,power:1000,type:'Personaje',art:'🐺',ability:'Despertar: gana +300 poder este turno.',awakening:{kind:'self',boost:300},rarity:'Común',traits:['Bestia','Despertar']},
{id:'A09',name:'Guerrero del Eclipse',cost:3,power:1200,type:'Personaje',art:'⚔️',ability:'Al ser derrotado: recupera 1 DON usado.',onKO:'donRecover',rarity:'Rara',traits:['Eclipse']},
{id:'A10',name:'Arquera del Alba',cost:2,power:800,type:'Personaje',art:'🏹',ability:'Al entrar: un enemigo pierde 300 poder este turno.',onPlay:'debuff300',rarity:'Común',traits:['Aurora']},
{id:'A11',name:'Monje del Umbral',cost:3,power:1000,type:'Personaje',art:'🧘',ability:'Despertar: roba 1 carta.',awakening:{kind:'self',draw:1},rarity:'Rara',traits:['Umbral','Despertar']},
{id:'A12',name:'Bestia de Cristal',cost:3,power:1300,type:'Personaje',art:'💎',ability:'Si controlas otro personaje Despertado, gana +200.',onPlay:'awakenedBonus',rarity:'Rara',traits:['Bestia']},
{id:'A13',name:'Centinela Astral',cost:4,power:1600,type:'Personaje',art:'🌠',ability:'🛡️ BLOCKER.',blocker:true,rarity:'Rara',traits:['Astral']},
{id:'A14',name:'Caballero Renacido',cost:4,power:1800,type:'Personaje',art:'🛡️',ability:'Despertar: gana +500 poder este turno.',awakening:{kind:'self',boost:500},rarity:'Rara',traits:['Despertar']},
{id:'A15',name:'Dragón del Despertar',cost:5,power:2300,type:'Personaje',art:'🐉',ability:'Despertar: gana +700 poder este turno.',awakening:{kind:'self',boost:700},rarity:'Súper Rara',traits:['Dragón','Despertar']},
{id:'A16',name:'Guardiana del Umbral',cost:4,power:1500,type:'Personaje',art:'🪽',ability:'Cuando otro personaje despierte, dale +300 poder este turno.',onAwakenOther:{boost:300},rarity:'Rara',traits:['Umbral']},
{id:'A17',name:'Titán de la Aurora',cost:5,power:2500,type:'Personaje',art:'🌄',ability:'Si tienes 3+ DON, gana +500 poder.',onPlay:'donPower500',rarity:'Súper Rara',traits:['Aurora']},
{id:'A18',name:'Cazador del Eclipse',cost:3,power:1400,type:'Personaje',art:'🏹',ability:'Cuando derrota un personaje, mira 1 carta de la mano rival.',onDefeatPeek:1,rarity:'Rara',traits:['Eclipse']},
{id:'A19',name:'Fénix Renacido',cost:5,power:2100,type:'Personaje',art:'🔥',ability:'Al ser derrotado, si despertó, vuelve a tu mano.',onKO:'returnSelfIfAwakened',rarity:'Súper Rara',traits:['Bestia','Despertar']},
{id:'A20',name:'Maestro de los Sellos',cost:4,power:1300,type:'Personaje',art:'🔒',ability:'Despertar: elimina un efecto temporal enemigo.',awakening:{kind:'clearEnemyTemp'},rarity:'Rara',traits:['Umbral']},
{id:'A21',name:'Bestia Primordial',cost:6,power:2700,type:'Personaje',art:'🦖',ability:'Despertar: gana +1000 poder este turno.',awakening:{kind:'self',boost:1000},rarity:'Súper Rara',traits:['Bestia','Despertar']},
{id:'A22',name:'Espadachín del Vacío',cost:4,power:1900,type:'Personaje',art:'🌌',ability:'Si tienes menos cartas en mano que el rival, gana +500.',onPlay:'handGap500',rarity:'Rara',traits:['Vacío']},
{id:'A23',name:'Dragón Celestial',cost:6,power:3000,type:'Personaje',art:'🐲',ability:'Despertar: derrota un enemigo de 1500 o menos.',awakening:{kind:'ko1500'},rarity:'Ultra Rara',traits:['Dragón','Despertar']},
{id:'A24',name:'Reina de las Estrellas',cost:5,power:2200,type:'Personaje',art:'👑',ability:'Despertar: roba 2 y descarta 1.',awakening:{kind:'draw2Discard'},rarity:'Súper Rara',traits:['Astral','Despertar']},
{id:'A25',name:'Coloso del Eclipse',cost:7,power:3500,type:'Personaje',art:'🗿',ability:'No puede atacar al entrar. Despertar: puede atacar inmediatamente.',awakening:{kind:'ready'},rarity:'Ultra Rara',traits:['Eclipse','Despertar']},
{id:'A26',name:'Guerrero de la Primera Llama',cost:6,power:2800,type:'Personaje',art:'🔥',ability:'Cada vez que recibe DON, gana +200 este turno.',onDonAttach:200,rarity:'Súper Rara',traits:['Llama']},
{id:'A27',name:'Oráculo Despierto',cost:5,power:1600,type:'Personaje',art:'🔭',ability:'Una vez por turno: mira las 3 primeras cartas y reordénalas.',active:'peek3',rarity:'Súper Rara',traits:['Astral']},
{id:'A28',name:'Fénix de la Segunda Era',cost:7,power:3000,type:'Personaje',art:'🪽',ability:'Al ser derrotado: recupera hasta 2 cartas de tu cementerio.',onKO:'recover2',rarity:'Ultra Rara',traits:['Bestia']},
{id:'A29',name:'Avatar del Despertar',cost:8,power:4000,type:'Personaje',art:'🌟',ability:'Despertar: +1500 poder y puede atacar a un personaje listo.',awakening:{kind:'self',boost:1500},rarity:'Ultra Rara',traits:['Despertar']},
{id:'A30',name:'Rey del Vacío',cost:8,power:3800,type:'Personaje',art:'👹',ability:'Despertar: devuelve hasta 2 enemigos de coste 4 o menos a la mano.',awakening:{kind:'bounceCost4x2'},rarity:'Ultra Rara',traits:['Vacío','Despertar']},
{id:'A31',name:'Dragón de la Primera Luz',cost:9,power:4500,type:'Personaje',art:'☀️',ability:'Despertar: roba 3 cartas.',awakening:{kind:'draw3'},rarity:'Ultra Rara',traits:['Dragón','Despertar']},
{id:'A32',name:'Soberano de las Eras',cost:10,power:5000,type:'Personaje',art:'⏳',ability:'Una vez por turno: reactiva el Despertar de uno de tus personajes.',active:'reactivateAwakening',rarity:'Legendaria',traits:['Despertar']},
{id:'A33',name:'Primer Despertar',cost:1,power:0,type:'Evento',art:'✨',ability:'Activa inmediatamente el Despertar de un personaje tuyo.',effect:'awakenTarget',rarity:'Común'},
{id:'A34',name:'Llamado de la Aurora',cost:2,power:0,type:'Evento',art:'🌅',ability:'Un personaje tuyo gana +700 poder este turno.',effect:'boost700',rarity:'Común'},
{id:'A35',name:'Ruptura del Sello',cost:3,power:0,type:'Evento',art:'🔓',ability:'Un personaje enemigo pierde sus habilidades este turno.',effect:'clearEnemyTemp',rarity:'Rara'},
{id:'A36',name:'Eclipse Total',cost:4,power:0,type:'Evento',art:'🌑',ability:'Un enemigo pierde 1000 poder; si está Despertado, pierde 500 adicionales.',effect:'eclipseDebuff',rarity:'Rara'},
{id:'A37',name:'Renacer',cost:4,power:0,type:'Evento',art:'♻️',ability:'Recupera un personaje de coste 3 o menos del cementerio a tu mano.',effect:'recover3',rarity:'Súper Rara'},
{id:'A38',name:'Sobrecarga Astral',cost:3,power:0,type:'Evento',art:'⚡',ability:'Un personaje recibe 2 DON adicionales este turno.',effect:'tempDon2',rarity:'Súper Rara'},
{id:'A39',name:'Fragmento del Despertar',cost:1,power:0,type:'Recurso',art:'💠',ability:'Roba 1 carta.',effect:'draw',rarity:'Común'},
{id:'A40',name:'Núcleo Primordial',cost:2,power:0,type:'Recurso',art:'🔋',ability:'Recupera 1 DON usado a tu reserva.',effect:'donRecover',rarity:'Rara'}
];


// ==================== SET 03: SHADOWS ====================
const SET_03_LEADERS=[
 {id:'S01',name:'Varek, Señor de las Sombras',art:'🌑',color:'Púrpura',life:5,ability:'Una vez por turno: cuando uno de tus personajes sea derrotado, otro personaje tuyo gana +500 poder este turno.'},
 {id:'S02',name:'Morgana, Reina del Cementerio',art:'💀',color:'Azul',life:5,ability:'Una vez por turno: cuando recuperes una carta de un cementerio, roba 1 carta y descarta 1.'},
 {id:'S03',name:'Drazek, Heraldo Infernal',art:'🔥',color:'Rojo',life:5,ability:'Una vez por turno: cuando uno de tus personajes derrote a otro, gana +700 poder este turno.'},
 {id:'S04',name:'Erebus, Guardián del Abismo',art:'👹',color:'Verde',life:5,ability:'Tus personajes que hayan regresado del cementerio ganan +300 poder mientras estén en tu campo.'}
];
const SET_03_CARDS=[
{id:'S05',name:'Espectro del Abismo',cost:1,power:500,type:'Personaje',art:'👻',ability:'Al ser derrotado: mira la carta superior de tu mazo.',onKO:'peekTop',rarity:'Común',traits:['Sombra']},
{id:'S06',name:'Caminante de Sombras',cost:2,power:700,type:'Personaje',art:'🌘',ability:'Si tienes 3+ cartas en tu cementerio, gana +300.',onPlay:'graveBonus300',rarity:'Común',traits:['Sombra']},
{id:'S07',name:'Guardián Sepulcral',cost:2,power:900,type:'Personaje',art:'🪦',ability:'🛡️ BLOCKER.',blocker:true,rarity:'Común',traits:['Cementerio']},
{id:'S08',name:'Lobo Infernal',cost:2,power:1000,type:'Personaje',art:'🐺',ability:'Cuando otro personaje tuyo sea derrotado, gana +300 este turno.',onAllyKO:300,rarity:'Común',traits:['Bestia','Sombra']},
{id:'S09',name:'Sacerdote de las Sombras',cost:3,power:900,type:'Personaje',art:'🕯️',ability:'Al entrar: recupera 1 carta de tu cementerio a tu mano.',onPlay:'recover1',rarity:'Rara',traits:['Sombra']},
{id:'S10',name:'Cazadora Nocturna',cost:2,power:800,type:'Personaje',art:'🏹',ability:'Al entrar: un enemigo pierde 300 poder este turno.',onPlay:'debuff300',rarity:'Común',traits:['Noche']},
{id:'S11',name:'Guerrero Maldito',cost:3,power:1300,type:'Personaje',art:'⚔️',ability:'Si fue recuperado del cementerio, gana +500.',onRecoverBoost:500,rarity:'Rara',traits:['Maldito']},
{id:'S12',name:'Bestia del Abismo',cost:3,power:1400,type:'Personaje',art:'🦁',ability:'Si tienes 5+ cartas en cementerio, gana +300.',onPlay:'graveBonus300',rarity:'Rara',traits:['Bestia']},
{id:'S13',name:'Caballero de la Tumba',cost:4,power:1700,type:'Personaje',art:'⚰️',ability:'Al ser derrotado: recupera 1 DON usado.',onKO:'donRecover',rarity:'Rara',traits:['Cementerio']},
{id:'S14',name:'Demonio de Ceniza',cost:4,power:1800,type:'Personaje',art:'😈',ability:'Cuando derrota a un personaje, mira 1 carta de la mano rival.',onDefeatPeek:1,rarity:'Súper Rara',traits:['Infernal']},
{id:'S15',name:'Dragón Infernal',cost:5,power:2300,type:'Personaje',art:'🐲',ability:'Si otro personaje fue derrotado este turno, gana +700.',onPlay:'deathBoost700',rarity:'Súper Rara',traits:['Dragón','Infernal']},
{id:'S16',name:'Reina de los Espectros',cost:4,power:1500,type:'Personaje',art:'👑',ability:'Al entrar: recupera 1 personaje de coste 2 o menos del cementerio.',onPlay:'recoverCost2',rarity:'Rara',traits:['Sombra']},
{id:'S17',name:'Titán del Abismo',cost:5,power:2500,type:'Personaje',art:'🗿',ability:'Si tienes 7+ cartas en cementerio, gana +500.',onPlay:'graveBonus500',rarity:'Súper Rara',traits:['Abismo']},
{id:'S18',name:'Asesino del Vacío',cost:3,power:1400,type:'Personaje',art:'🗡️',ability:'Cuando derrota a un personaje, el rival descarta 1 carta.',onDefeatDiscard:1,rarity:'Rara',traits:['Vacío']},
{id:'S19',name:'Fénix Oscuro',cost:5,power:2100,type:'Personaje',art:'🔥',ability:'Al ser derrotado: puedes devolverlo a tu mano.',onKO:'returnSelf',rarity:'Súper Rara',traits:['Bestia','Sombra']},
{id:'S20',name:'Maestro de las Sombras',cost:4,power:1300,type:'Personaje',art:'🧙',ability:'Una vez por turno: puedes sacrificar un personaje tuyo para robar 1.',active:'sacrificeDraw',rarity:'Rara',traits:['Sombra']},
{id:'S21',name:'Bestia Primordial Oscura',cost:6,power:2800,type:'Personaje',art:'🦖',ability:'Si tienes 8+ cartas en cementerio, gana +500.',onPlay:'graveBonus500',rarity:'Súper Rara',traits:['Bestia','Abismo']},
{id:'S22',name:'Espadachín Maldito',cost:4,power:1900,type:'Personaje',art:'⚔️',ability:'Si tienes menos cartas en mano que el rival, gana +500.',onPlay:'handGap500',rarity:'Rara',traits:['Maldito']},
{id:'S23',name:'Dragón de las Tinieblas',cost:6,power:3000,type:'Personaje',art:'🐉',ability:'Al entrar: derrota un enemigo de 1500 o menos.',onPlay:'ko1500',rarity:'Ultra Rara',traits:['Dragón','Infernal']},
{id:'S24',name:'Reina del Abismo',cost:5,power:2200,type:'Personaje',art:'👸',ability:'Cuando sea recuperada del cementerio, roba 2 y descarta 1.',onRecover:'draw2Discard',rarity:'Súper Rara',traits:['Abismo']},
{id:'S25',name:'Coloso de las Sombras',cost:7,power:3500,type:'Personaje',art:'🗿',ability:'No puede atacar al entrar. Si fue recuperado, puede atacar.',onRecover:'ready',rarity:'Ultra Rara',traits:['Sombra']},
{id:'S26',name:'Guerrero del Último Aliento',cost:6,power:2800,type:'Personaje',art:'💀',ability:'Cada vez que otro personaje tuyo sea derrotado, gana +200 mientras esté en campo.',onAllyKOPermanent:200,rarity:'Súper Rara',traits:['Maldito']},
{id:'S27',name:'Oráculo del Más Allá',cost:5,power:1600,type:'Personaje',art:'🔮',ability:'Una vez por turno: mira las 3 primeras cartas y reordénalas.',active:'peek3',rarity:'Súper Rara',traits:['Más Allá']},
{id:'S28',name:'Fénix del Inframundo',cost:7,power:3000,type:'Personaje',art:'🪽',ability:'Al ser derrotado: recupera hasta 2 cartas de tu cementerio.',onKO:'recover2',rarity:'Ultra Rara',traits:['Bestia','Inframundo']},
{id:'S29',name:'Avatar Infernal',cost:8,power:4000,type:'Personaje',art:'👹',ability:'Cuando otro personaje sea derrotado, gana +500 este turno.',onAllyKO:500,rarity:'Ultra Rara',traits:['Infernal']},
{id:'S30',name:'Rey del Abismo',cost:8,power:3800,type:'Personaje',art:'👑',ability:'Al entrar: devuelve hasta 2 enemigos de coste 4 o menos a la mano.',onPlay:'bounceCost4x2',rarity:'Ultra Rara',traits:['Abismo']},
{id:'S31',name:'Dragón de la Noche Eterna',cost:9,power:4500,type:'Personaje',art:'🌌',ability:'Al entrar: recupera hasta 2 personajes de tu cementerio a tu mano.',onPlay:'recover2',rarity:'Ultra Rara',traits:['Dragón']},
{id:'S32',name:'Soberano del Inframundo',cost:10,power:5000,type:'Personaje',art:'💀',ability:'Una vez por turno: reactiva el efecto de un personaje tuyo que diga "al ser derrotado".',active:'reactivateKO',rarity:'Legendaria',traits:['Inframundo']},
{id:'S33',name:'Pacto de las Sombras',cost:1,power:0,type:'Evento',art:'🩸',ability:'Derrota uno de tus personajes. Después roba 2 cartas.',effect:'sacrificeDraw2',rarity:'Común'},
{id:'S34',name:'Regreso del Más Allá',cost:2,power:0,type:'Evento',art:'🌀',ability:'Recupera un personaje de coste 3 o menos de tu cementerio a tu mano.',effect:'recover3',rarity:'Común'},
{id:'S35',name:'Maldición Infernal',cost:3,power:0,type:'Evento',art:'⛓️',ability:'Un enemigo pierde sus habilidades este turno y -700 poder.',effect:'curse',rarity:'Rara'},
{id:'S36',name:'Juicio de las Sombras',cost:4,power:0,type:'Evento',art:'⚖️',ability:'Derrota un enemigo de 1800 o menos. Si tienes 5+ cartas en cementerio, hasta 2200.',effect:'ko1800grave',rarity:'Rara'},
{id:'S37',name:'Último Suspiro',cost:4,power:0,type:'Evento',art:'🌫️',ability:'Cuando uno de tus personajes sea derrotado, puedes jugar desde tu mano un personaje de coste 3 o menos pagando 1 DON adicional.',effect:'lastBreath',rarity:'Súper Rara'},
{id:'S38',name:'Fragmento del Abismo',cost:1,power:0,type:'Recurso',art:'💠',ability:'Roba 1 carta. Si tienes 5+ cartas en cementerio, recupera 1 DON usado.',effect:'drawGraveCharge',rarity:'Común'},
{id:'S39',name:'Alma Condenada',cost:2,power:0,type:'Recurso',art:'👻',ability:'Recupera 1 personaje de coste 2 o menos de tu cementerio a tu mano.',effect:'recoverCost2',rarity:'Rara'},
{id:'S40',name:'Portal del Inframundo',cost:4,power:0,type:'Recurso',art:'🕳️',ability:'Recupera hasta 2 personajes de coste 4 o menos de tu cementerio a tu mano.',effect:'recoverCost4x2',rarity:'Súper Rara'}
];



// ==================== SET 04: COLLISION ====================
const SET_04_LEADERS=[
 {id:'C41',name:'Raze, Guerrero de la Colisión',art:'💥',color:'Rojo',life:5,ability:'Una vez por turno: cuando uno de tus personajes ataque, si tu Combo es 2+, gana +500 durante ese combate.'},
 {id:'C42',name:'Mira, Estratega del Vórtice',art:'🌀',color:'Azul',life:5,ability:'Una vez por turno: al llegar a Combo 3, mira las 3 primeras cartas y reordénalas.'},
 {id:'C43',name:'Torak, Titán del Impacto',art:'🗿',color:'Verde',life:5,ability:'Tus personajes con 2+ DON ganan +300. Con Combo 4, uno de ellos gana +500 adicional este turno.'},
 {id:'C44',name:'Veyra, Reina del Combo',art:'👑',color:'Púrpura',life:5,ability:'Una vez por turno: cuando una carta active Combo 3+, recupera 1 DON usado.'},
 {id:'C45',name:'Solen, Maestro de la Resonancia',art:'✨',color:'Amarillo',life:5,ability:'Una vez por turno: al llegar a Combo 2, roba 1 carta y descarta 1.'}
];
const SET_04_CARDS=[
{id:'C46',name:'Aprendiz del Impacto',cost:1,power:500,type:'Personaje',art:'🥊',ability:'Combo 2: gana +300 poder este turno.',combo:2,comboBoost:300,rarity:'Común'},
{id:'C47',name:'Corredora del Vórtice',cost:1,power:400,type:'Personaje',art:'🏃',ability:'Combo 2: mira la carta superior de tu mazo.',combo:2,comboEffect:'peekTop',rarity:'Común'},
{id:'C48',name:'Guardia de Resonancia',cost:2,power:900,type:'Personaje',art:'🛡️',ability:'🛡️ BLOCKER.',blocker:true,rarity:'Común'},
{id:'C49',name:'Luchador de la Cadena',cost:2,power:1000,type:'Personaje',art:'⛓️',ability:'Combo 2: gana +300 poder este turno.',combo:2,comboBoost:300,rarity:'Común'},
{id:'C50',name:'Arquera del Vórtice',cost:2,power:800,type:'Personaje',art:'🏹',ability:'Al entrar: un enemigo pierde 300 poder este turno.',onPlay:'debuff300',rarity:'Común'},
{id:'C51',name:'Monje de la Colisión',cost:3,power:1100,type:'Personaje',art:'🧘',ability:'Combo 3: roba 1 carta.',combo:3,comboEffect:'draw1',rarity:'Rara'},
{id:'C52',name:'Bestia de Resonancia',cost:3,power:1400,type:'Personaje',art:'🦁',ability:'Combo 2: gana +300 poder este turno.',combo:2,comboBoost:300,rarity:'Rara'},
{id:'C53',name:'Caballero del Impacto',cost:4,power:1800,type:'Personaje',art:'⚔️',ability:'Combo 3: gana +500 poder este turno.',combo:3,comboBoost:500,rarity:'Rara'},
{id:'C54',name:'Cazador del Vórtice',cost:3,power:1300,type:'Personaje',art:'🎯',ability:'Combo 3: mira 1 carta de la mano rival.',combo:3,comboEffect:'peekHand',rarity:'Rara'},
{id:'C55',name:'Guardián de la Cadena',cost:4,power:1600,type:'Personaje',art:'🛡️',ability:'🛡️ BLOCKER. Combo 4: gana +500 poder este turno.',blocker:true,combo:4,comboBoost:500,rarity:'Rara'},
{id:'C56',name:'Dragón de la Colisión',cost:5,power:2300,type:'Personaje',art:'🐲',ability:'Combo 3: gana +700 poder este turno.',combo:3,comboBoost:700,rarity:'Súper Rara'},
{id:'C57',name:'Reina de Resonancia',cost:5,power:2100,type:'Personaje',art:'👸',ability:'Combo 3: roba 2 y descarta 1.',combo:3,comboEffect:'draw2Discard',rarity:'Súper Rara'},
{id:'C58',name:'Titán del Vórtice',cost:6,power:2800,type:'Personaje',art:'🗿',ability:'Combo 4: gana +700 poder este turno.',combo:4,comboBoost:700,rarity:'Súper Rara'},
{id:'C59',name:'Espadachín de la Tormenta',cost:4,power:1900,type:'Personaje',art:'🌪️',ability:'Si tienes menos cartas en mano que el rival, gana +500.',onPlay:'handGap500',rarity:'Rara'},
{id:'C60',name:'Fénix de la Cadena',cost:5,power:2200,type:'Personaje',art:'🔥',ability:'Combo 4: puede atacar inmediatamente.',combo:4,comboEffect:'ready',rarity:'Súper Rara'},
{id:'C61',name:'Maestro de los Impactos',cost:4,power:1500,type:'Personaje',art:'🥋',ability:'Combo 2: otro personaje gana +500 este turno.',combo:2,comboEffect:'boostOther500',rarity:'Rara'},
{id:'C62',name:'Bestia del Vórtice',cost:5,power:2400,type:'Personaje',art:'🐯',ability:'Combo 3: un enemigo pierde 500 poder este turno.',combo:3,comboEffect:'debuff500',rarity:'Súper Rara'},
{id:'C63',name:'Caballero de la Resonancia',cost:5,power:2500,type:'Personaje',art:'🛡️',ability:'Combo 4: recupera 1 DON usado.',combo:4,comboEffect:'donRecover',rarity:'Súper Rara'},
{id:'C64',name:'Dragón del Combo',cost:6,power:3000,type:'Personaje',art:'🐉',ability:'Combo 3: +500. Combo 5: +500 adicional.',combo:3,comboBoost:500,combo5Boost:500,rarity:'Ultra Rara'},
{id:'C65',name:'Coloso del Impacto',cost:7,power:3500,type:'Personaje',art:'🗿',ability:'No puede atacar al entrar. Combo 4: puede atacar.',combo:4,comboEffect:'ready',rarity:'Ultra Rara'},
{id:'C66',name:'Oráculo de la Cadena',cost:5,power:1600,type:'Personaje',art:'🔮',ability:'Una vez por turno: mira las 3 primeras cartas y reordénalas.',active:'peek3',rarity:'Súper Rara'},
{id:'C67',name:'Guerrero del Último Combo',cost:6,power:2900,type:'Personaje',art:'💀',ability:'Combo 5: gana +1000 poder este turno.',combo:5,comboBoost:1000,rarity:'Ultra Rara'},
{id:'C68',name:'Fénix de la Resonancia',cost:7,power:3100,type:'Personaje',art:'🪽',ability:'Al ser derrotado: recupera 2 cartas del cementerio a tu mano.',onKO:'recover2',rarity:'Ultra Rara'},
{id:'C69',name:'Avatar de la Colisión',cost:8,power:4000,type:'Personaje',art:'🌟',ability:'Combo 4: gana +1000 y puede atacar a un personaje listo.',combo:4,comboBoost:1000,rarity:'Ultra Rara'},
{id:'C70',name:'Soberano del Combo',cost:10,power:5000,type:'Personaje',art:'👑',ability:'Una vez por turno: repite el efecto de Combo 3 o inferior de un personaje tuyo.',active:'repeatCombo',rarity:'Legendaria'},
{id:'C71',name:'Primer Impacto',cost:1,power:0,type:'Evento',art:'💥',ability:'Un personaje gana +500; con Combo 2, gana +300 adicional.',effect:'collisionBoost800',rarity:'Común'},
{id:'C72',name:'Cadena Relámpago',cost:1,power:0,type:'Evento',art:'⚡',ability:'Roba 1; con Combo 3, roba otra y descarta 1.',effect:'collisionDraw',rarity:'Común'},
{id:'C73',name:'Golpe del Vórtice',cost:2,power:0,type:'Evento',art:'🌀',ability:'Un enemigo pierde 700 poder este turno.',effect:'debuff700',rarity:'Común'},
{id:'C74',name:'Resonancia Total',cost:2,power:0,type:'Evento',art:'🔊',ability:'Un personaje gana +1000; con Combo 3 puede atacar inmediatamente.',effect:'collisionBoostReady',rarity:'Rara'},
{id:'C75',name:'Rompeformaciones',cost:3,power:0,type:'Evento',art:'💢',ability:'Un enemigo pierde sus habilidades este turno.',effect:'clearEnemyTemp',rarity:'Rara'},
{id:'C76',name:'Doble Impacto',cost:2,power:0,type:'Evento',art:'✌️',ability:'Un personaje puede realizar un segundo ataque; con Combo 4 gana +500 durante ese ataque.',effect:'secondAttack',rarity:'Rara'},
{id:'C77',name:'Vórtice Inverso',cost:3,power:0,type:'Evento',art:'↩️',ability:'Devuelve un enemigo de coste 4 o menos a la mano.',effect:'bounceCost4',rarity:'Rara'},
{id:'C78',name:'Sobrecarga de Combo',cost:3,power:0,type:'Evento',art:'⚡',ability:'Aumenta inmediatamente tu Combo en 2.',effect:'comboPlus2',rarity:'Súper Rara'},
{id:'C79',name:'Colisión Suprema',cost:4,power:0,type:'Evento',art:'🌠',ability:'Un personaje gana +1500; con Combo 4 puede atacar al Líder.',effect:'collisionBoostLeader',rarity:'Súper Rara'},
{id:'C80',name:'Cadena Destructiva',cost:4,power:0,type:'Evento',art:'💥',ability:'Derrota un enemigo de 1800 o menos; con Combo 5, hasta 2500.',effect:'koCollision',rarity:'Súper Rara'},
{id:'C81',name:'Resonancia Temporal',cost:2,power:0,type:'Evento',art:'⏳',ability:'Reutiliza una habilidad activada este turno.',effect:'reuseAbility',rarity:'Rara'},
{id:'C82',name:'Impacto Final',cost:5,power:0,type:'Evento',art:'🌋',ability:'Un enemigo pierde 1500; con Combo 4, si queda en 1500 o menos es derrotado.',effect:'impactFinal',rarity:'Ultra Rara'},
{id:'C83',name:'Tormenta de Colisión',cost:5,power:0,type:'Evento',art:'🌩️',ability:'Todos los enemigos pierden 700; con Combo 5 pierden sus habilidades este turno.',effect:'stormCollision',rarity:'Ultra Rara'},
{id:'C84',name:'Combo Infinito',cost:6,power:0,type:'Evento',art:'♾️',ability:'Para efectos de cartas, tu Combo cuenta como +3 este turno.',effect:'comboPlus3Temp',rarity:'Ultra Rara'},
{id:'C85',name:'Golpe de la Leyenda',cost:7,power:0,type:'Evento',art:'🏆',ability:'Un personaje gana +2000; con Combo 5, después de atacar puede quedar listo otra vez.',effect:'legendCombo',rarity:'Legendaria'},
{id:'C86',name:'Fragmento de Resonancia',cost:1,power:0,type:'Recurso',art:'💠',ability:'Roba 1 carta.',effect:'draw',rarity:'Común'},
{id:'C87',name:'Núcleo del Vórtice',cost:1,power:0,type:'Recurso',art:'🌀',ability:'Combo +1.',effect:'comboPlus1',rarity:'Común'},
{id:'C88',name:'Cristal de Impacto',cost:2,power:0,type:'Recurso',art:'💎',ability:'Recupera 1 DON usado.',effect:'donRecover',rarity:'Rara'},
{id:'C89',name:'Motor de Cadena',cost:2,power:0,type:'Recurso',art:'⚙️',ability:'Roba 2 y descarta 1.',effect:'draw2Discard',rarity:'Rara'},
{id:'C90',name:'Núcleo de Colisión',cost:3,power:0,type:'Recurso',art:'🔷',ability:'Un personaje gana +500 poder este turno.',effect:'boost500',rarity:'Rara'},
{id:'C91',name:'Fragmento del Combo',cost:3,power:0,type:'Recurso',art:'🔶',ability:'Combo +2.',effect:'comboPlus2',rarity:'Súper Rara'},
{id:'C92',name:'Reactor de Resonancia',cost:4,power:0,type:'Recurso',art:'🔋',ability:'Recupera 2 DON usados.',effect:'donRecover2',rarity:'Súper Rara'},
{id:'C93',name:'Corazón del Vórtice',cost:4,power:0,type:'Recurso',art:'❤️‍🔥',ability:'Roba 3 y descarta 1.',effect:'draw3Discard',rarity:'Ultra Rara'},
{id:'C94',name:'Motor de la Primera Colisión',cost:5,power:0,type:'Recurso',art:'⚙️',ability:'Combo +3.',effect:'comboPlus3',rarity:'Ultra Rara'},
{id:'C95',name:'Núcleo de la Leyenda',cost:6,power:0,type:'Recurso',art:'🌟',ability:'Roba 4 y recupera 2 DON usados.',effect:'legendCore',rarity:'Legendaria'}
];



// ==================== SET 05: RABBIT HOLE ====================
// La quinta expansión gira alrededor de Rabbit Hole: sobrevivir una vez al borde de la derrota.
const SET_05_LEADERS=[
 {id:'R01',name:'Aster, Caminante del Rabbit Hole',art:'🐇',color:'Rojo',life:5,ability:'Una vez por turno: si tienes 0 ❤️, un personaje que ataques gana +500 poder este combate.'},
 {id:'R02',name:'Mira, Guardiana del Umbral',art:'🕳️',color:'Azul',life:5,ability:'Una vez por turno: al jugar un Evento de Rabbit Hole, mira las 3 primeras cartas y reordénalas.'},
 {id:'R03',name:'Orion, Rey de la Madriguera',art:'👑',color:'Verde',life:5,ability:'Tus personajes con 2+ DON ganan +300 poder. Si tienes 0 ❤️, ganan +500 adicional.'},
 {id:'R04',name:'Nyra, Reina del Último Camino',art:'🌑',color:'Morado',life:5,ability:'Una vez por turno: cuando un personaje tuyo sea derrotado, recupera 1 DON usado si tienes 2 o menos cartas en mano.'},
 {id:'R05',name:'Seraph, Testigo de la Segunda Oportunidad',art:'✨',color:'Amarillo',life:5,ability:'Una vez por turno: si tienes 1 ❤️ o menos, cuando un Evento tuyo resuelva, recupera 1 escudo si tienes menos de 3.'},
 {id:'R06',name:'EON, Leyenda del Otro Lado',art:'🌌',color:'Multicolor',life:5,ability:'Una vez por partida: si activaste Rabbit Hole, un personaje tuyo puede atacar inmediatamente este turno.'}
];
const SET_05_CARDS=[
 {id:'R07',name:'Conejo del Umbral',cost:1,power:500,type:'Personaje',art:'🐇',ability:'Al entrar: si tienes 1 ❤️ o menos, roba 1 carta.',onPlay:'rabbitDraw',rarity:'Común',traits:['Rabbit Hole']},
 {id:'R08',name:'Exploradora de la Madriguera',cost:2,power:700,type:'Personaje',art:'🔦',ability:'Al entrar: mira las 2 primeras cartas y coloca 1 en tu mano.',onPlay:'peek2',rarity:'Común',traits:['Rabbit Hole']},
 {id:'R09',name:'Guardián del Umbral',cost:2,power:900,type:'Personaje',art:'🚪',ability:'🛡️ BLOCKER.',blocker:true,rarity:'Común',traits:['Umbral']},
 {id:'R10',name:'Corredor Imposible',cost:2,power:1000,type:'Personaje',art:'🏃',ability:'Si tienes 1 ❤️ o menos, gana +400 poder.',onPlay:'rabbitPower',rarity:'Común',traits:['Rabbit Hole']},
 {id:'R11',name:'Cartógrafa del Abismo',cost:3,power:900,type:'Personaje',art:'🗺️',ability:'Al entrar: mira 3 cartas; añade 1 carta Rabbit Hole a tu mano si aparece.',onPlay:'findRabbit',rarity:'Rara',traits:['Rabbit Hole']},
 {id:'R12',name:'Caballero del Otro Lado',cost:3,power:1300,type:'Personaje',art:'⚔️',ability:'Si tienes 0 ❤️, gana +700 poder.',onPlay:'lastPath',rarity:'Rara',traits:['Umbral']},
 {id:'R13',name:'Conejo de Cristal',cost:3,power:1200,type:'Personaje',art:'🐇',ability:'Cuando sea derrotado: roba 1 carta si tienes 1 ❤️ o menos.',onKO:'rabbitDraw',rarity:'Rara',traits:['Rabbit Hole']},
 {id:'R14',name:'Centinela del Laberinto',cost:4,power:1600,type:'Personaje',art:'🧭',ability:'🛡️ BLOCKER. Si tienes 0 ❤️, gana +500 poder.',blocker:true,rarity:'Rara',traits:['Umbral']},
 {id:'R15',name:'Bestia de la Madriguera',cost:4,power:1900,type:'Personaje',art:'🐺',ability:'Si Rabbit Hole está disponible para ti, gana +300 poder.',onPlay:'rabbitReadyBonus',rarity:'Rara',traits:['Bestia','Rabbit Hole']},
 {id:'R16',name:'Maestro del Umbral',cost:4,power:1400,type:'Personaje',art:'🧙',ability:'Una vez por turno: mira la carta superior de tu mazo; puedes dejarla arriba o mandarla al fondo.',active:'scry1',rarity:'Rara',traits:['Umbral']},
 {id:'R17',name:'Fénix de la Madriguera',cost:5,power:2200,type:'Personaje',art:'🔥',ability:'💀 Último Aliento: si tienes 1 ❤️ o menos, devuelve esta carta a tu mano.',onKO:'rabbitReturn',rarity:'Súper Rara',traits:['Rabbit Hole']},
 {id:'R18',name:'Guardián de las Dos Salidas',cost:5,power:2300,type:'Personaje',art:'🚪',ability:'Cuando un Evento Rabbit Hole tuyo se resuelve, gana +500 este turno.',onPlay:'exitGuard',rarity:'Súper Rara',traits:['Umbral']},
 {id:'R19',name:'Dragón del Agujero',cost:6,power:2800,type:'Personaje',art:'🐉',ability:'Si tienes 0 ❤️, puede atacar personajes listos del rival.',onPlay:'holeDragon',rarity:'Súper Rara',traits:['Rabbit Hole']},
 {id:'R20',name:'Reina de las Madrigueras',cost:6,power:2600,type:'Personaje',art:'👸',ability:'Al entrar: recupera 1 carta Rabbit Hole de tu cementerio a tu mano.',onPlay:'recoverRabbit',rarity:'Súper Rara',traits:['Rabbit Hole']},
 {id:'R21',name:'Titán del Último Camino',cost:7,power:3400,type:'Personaje',art:'🗿',ability:'Si tienes 0 ❤️, gana +800 poder y no puede ser debilitado este turno.',onPlay:'lastTitan',rarity:'Ultra Rara',traits:['Umbral']},
 {id:'R22',name:'Oráculo de la Madriguera',cost:5,power:1600,type:'Personaje',art:'🔮',ability:'Una vez por turno: mira las 3 primeras cartas y reordénalas.',active:'scry3',rarity:'Súper Rara',traits:['Rabbit Hole']},
 {id:'R23',name:'Cazador de Salidas',cost:4,power:1800,type:'Personaje',art:'🏹',ability:'Al derrotar un personaje: roba 1 carta si tienes 0 ❤️.',onKO:'hunterDraw',rarity:'Rara',traits:['Umbral']},
 {id:'R24',name:'Soberano del Rabbit Hole',cost:8,power:3900,type:'Personaje',art:'🐇',ability:'Al entrar: si tienes 0 ❤️, recupera 1 DON usado y roba 2 cartas.',onPlay:'rabbitSovereign',rarity:'Ultra Rara',traits:['Rabbit Hole']},
 {id:'R25',name:'Leyenda del Otro Lado',cost:9,power:4500,type:'Personaje',art:'🌌',ability:'Si Rabbit Hole fue activado, gana +1000 poder. Si no, gana +300.',onPlay:'otherSide',rarity:'Legendaria',traits:['Legendaria','Rabbit Hole']},
 {id:'R26',name:'Entidad de la Madriguera',cost:10,power:5000,type:'Personaje',art:'👁️',ability:'Una vez por partida: si tienes 0 ❤️, puedes devolver 1 personaje enemigo a la mano.',active:'holeBounce',rarity:'Legendaria',traits:['Legendaria','Rabbit Hole']},
 {id:'R27',name:'Última Puerta',cost:1,power:0,type:'Evento',art:'🚪',ability:'Un personaje tuyo gana +700 poder este turno. Si tienes 0 ❤️, gana +300 adicional.',effect:'lastDoor',rarity:'Común'},
 {id:'R28',name:'Caída al Rabbit Hole',cost:1,power:0,type:'Evento',art:'🕳️',ability:'Mira las 3 primeras cartas y reordénalas. Si tienes 1 ❤️ o menos, roba 1.',effect:'fallHole',rarity:'Común'},
 {id:'R29',name:'Desvío Imposible',cost:2,power:0,type:'Evento',art:'↪️',ability:'Un enemigo pierde 700 poder. Si tienes 0 ❤️, pierde 1000.',effect:'impossibleTurn',rarity:'Común'},
 {id:'R30',name:'Segunda Salida',cost:2,power:0,type:'Evento',art:'🛣️',ability:'Recupera 1 carta Rabbit Hole de tu cementerio a tu mano.',effect:'recoverRabbit',rarity:'Rara'},
 {id:'R31',name:'Puerta Espejo',cost:2,power:0,type:'Evento',art:'🪞',ability:'Un personaje enemigo pierde sus habilidades este turno.',effect:'mirrorGate',rarity:'Rara'},
 {id:'R32',name:'Último Latido',cost:3,power:0,type:'Evento',art:'❤️‍🔥',ability:'Si tienes 0 ❤️, recupera 1 escudo. Si no, roba 1 carta.',effect:'lastBeat',rarity:'Rara'},
 {id:'R33',name:'Ruta de Escape',cost:3,power:0,type:'Evento',art:'🛤️',ability:'Prepara un personaje tuyo. Si tienes 0 ❤️, también gana +500 este turno.',effect:'escapeRoute',rarity:'Rara'},
 {id:'R34',name:'La Otra Puerta',cost:4,power:0,type:'Evento',art:'🌗',ability:'Devuelve un personaje enemigo de coste 4 o menos a la mano.',effect:'otherDoor',rarity:'Súper Rara'},
 {id:'R35',name:'Tiempo Roto',cost:4,power:0,type:'Evento',art:'⌛',ability:'Reutiliza una habilidad activada este turno. Si tienes 0 ❤️, recupera 1 DON usado.',effect:'brokenTime',rarity:'Súper Rara'},
 {id:'R36',name:'Madriguera Infinita',cost:5,power:0,type:'Evento',art:'♾️',ability:'Hasta el final del turno, tus personajes con 0 ❤️ en tu estado ganan +800 poder.',effect:'infiniteHole',rarity:'Súper Rara'},
 {id:'R37',name:'Juicio del Umbral',cost:5,power:0,type:'Evento',art:'⚖️',ability:'Derrota un enemigo de 1800 o menos. Si tienes 0 ❤️, hasta 2400.',effect:'thresholdJudgment',rarity:'Ultra Rara'},
 {id:'R38',name:'Camino sin Regreso',cost:6,power:0,type:'Evento',art:'🌑',ability:'Todos los enemigos pierden 1000 poder. Si tienes 0 ❤️, además pierden sus habilidades este turno.',effect:'noReturn',rarity:'Ultra Rara'},
 {id:'R39',name:'Salto de Realidad',cost:6,power:0,type:'Evento',art:'✨',ability:'Devuelve hasta 2 personajes tuyos del campo a tu mano; roba 2 cartas.',effect:'realityJump',rarity:'Ultra Rara'},
 {id:'R40',name:'Leyendas Inmortales',cost:0,power:0,type:'Evento',art:'🐇',ability:'RABBIT HOLE: si tienes 0 ❤️ y fueras a perder por un ataque al Líder, ignora ese ataque. Se consume y solo puede activarse una vez por partida.',effect:'rabbitHole',rarity:'Legendaria',traits:['Rabbit Hole','Legendaria']},
 {id:'R41',name:'Puerta de Emergencia',cost:1,power:0,type:'Recurso',art:'🆘',ability:'Roba 1 carta. Si tienes 0 ❤️, recupera 1 DON usado.',effect:'emergencyDoor',rarity:'Común'},
 {id:'R42',name:'Mapa del Otro Lado',cost:2,power:0,type:'Recurso',art:'🗺️',ability:'Roba 2 y descarta 1.',effect:'draw2Discard',rarity:'Común'},
 {id:'R43',name:'Llave del Umbral',cost:2,power:0,type:'Recurso',art:'🗝️',ability:'Rabbit Hole disponible: si tienes Leyendas Inmortales en tu mano, puedes conservarla visible hasta que sea necesaria.',effect:'rabbitKey',rarity:'Rara'},
 {id:'R44',name:'Cristal de Supervivencia',cost:2,power:0,type:'Recurso',art:'💎',ability:'Si tienes 1 ❤️ o menos, roba 1 y recupera 1 escudo si tienes menos de 3.',effect:'survivalCrystal',rarity:'Rara'},
 {id:'R45',name:'Núcleo de la Madriguera',cost:3,power:0,type:'Recurso',art:'🌀',ability:'Recupera 1 DON usado y, si tienes 0 ❤️, gana Combo +1.',effect:'holeCore',rarity:'Rara'},
 {id:'R46',name:'Reloj del Umbral',cost:3,power:0,type:'Recurso',art:'⏱️',ability:'Mira las 3 primeras cartas; coloca 1 arriba y 2 abajo en cualquier orden.',effect:'thresholdClock',rarity:'Rara'},
 {id:'R47',name:'Fragmento de Salida',cost:4,power:0,type:'Recurso',art:'🔷',ability:'Devuelve 1 personaje de coste 3 o menos de tu cementerio a tu mano.',effect:'recoverLow',rarity:'Súper Rara'},
 {id:'R48',name:'Corazón del Conejo',cost:4,power:0,type:'Recurso',art:'❤️🐇',ability:'Roba 3 y descarta 1. Si tienes 0 ❤️, recupera además 1 DON usado.',effect:'rabbitHeart',rarity:'Súper Rara'},
 {id:'R49',name:'Motor de la Madriguera',cost:5,power:0,type:'Recurso',art:'⚙️',ability:'Recupera 2 DON usados. Si Rabbit Hole fue activado, roba 1.',effect:'holeEngine',rarity:'Ultra Rara'},
 {id:'R50',name:'Portal de Dos Mundos',cost:5,power:0,type:'Recurso',art:'🌌',ability:'Recupera hasta 2 cartas Rabbit Hole de tu cementerio a tu mano.',effect:'twoWorlds',rarity:'Ultra Rara'},
 {id:'R51',name:'Corona del Último Camino',cost:6,power:0,type:'Recurso',art:'👑',ability:'Un personaje gana +1500. Si tienes 0 ❤️, puede atacar al Líder este turno.',effect:'lastCrown',rarity:'Ultra Rara'},
 {id:'R52',name:'Archivo de la Madriguera',cost:6,power:0,type:'Recurso',art:'📚',ability:'Roba 4 y descarta 1. Si Rabbit Hole está disponible, conserva 1 carta extra.',effect:'holeArchive',rarity:'Legendaria'},
 {id:'R53',name:'Entrada al Imposible',cost:7,power:0,type:'Recurso',art:'🕳️✨',ability:'Recupera 2 DON usados, roba 2 y mira las 5 primeras cartas.',effect:'impossibleEntry',rarity:'Legendaria'},
 {id:'R54',name:'Rastro del Conejo',cost:1,power:0,type:'Evento',art:'🐾',ability:'Busca en las 5 primeras cartas una carta Rabbit Hole y añádela a tu mano; baraja el resto.',effect:'rabbitSearch',rarity:'Rara'},
 {id:'R55',name:'Eco de la Segunda Oportunidad',cost:3,power:0,type:'Evento',art:'🔔',ability:'Si Rabbit Hole ya fue activado, recupera 1 escudo y roba 1. Si no, roba 2.',effect:'secondChance',rarity:'Súper Rara'},
 {id:'R56',name:'Caída Controlada',cost:2,power:0,type:'Evento',art:'🪂',ability:'Un personaje tuyo gana +500 y no puede ser derrotado por un efecto este turno.',effect:'controlledFall',rarity:'Rara'},
 {id:'R57',name:'Señor del Umbral',cost:5,power:2400,type:'Personaje',art:'🗿',ability:'Cuando tienes 0 ❤️, cada carta Rabbit Hole que juegues este turno cuesta 1 DON menos (mínimo 0).',onPlay:'thresholdLord',rarity:'Súper Rara',traits:['Umbral']},
 {id:'R58',name:'Guardián de la Última Vida',cost:4,power:1700,type:'Personaje',art:'🛡️',ability:'Si tienes 1 ❤️ o menos, tus escudos no pueden ser reducidos por efectos este turno.',onPlay:'lastLifeGuard',rarity:'Rara',traits:['Umbral']},
 {id:'R59',name:'Avatar del Rabbit Hole',cost:8,power:4000,type:'Personaje',art:'🐇🌌',ability:'Si tienes 0 ❤️ y Rabbit Hole fue activado, gana +1500 y puede atacar al Líder inmediatamente.',onPlay:'rabbitAvatar',rarity:'Legendaria',traits:['Legendaria','Rabbit Hole']},
 {id:'R60',name:'La Leyenda que Regresa',cost:9,power:4600,type:'Personaje',art:'✨🐇',ability:'Al entrar: si Rabbit Hole fue activado, recupera hasta 2 cartas de tu cementerio a tu mano y recupera 1 DON usado.',onPlay:'legendReturns',rarity:'Legendaria',traits:['Legendaria','Rabbit Hole']}
];
const ALL_LEADERS=[...SET_01_LEADERS,...SET_02_LEADERS,...SET_03_LEADERS,...SET_04_LEADERS,...SET_05_LEADERS];
const ALL_CARDS=[...SET_01_CARDS,...SET_02_CARDS,...SET_03_CARDS,...SET_04_CARDS,...SET_05_CARDS];
GLTCG.LEADERS=ALL_LEADERS;
GLTCG.CARD_LIBRARY=ALL_CARDS;
GLTCG.SETS={
 ORIGINS:{id:'ORIGINS',name:'SET 01 — ORIGINS',cards:SET_01_CARDS,leaders:SET_01_LEADERS,theme:'⚔️ Fundamentos'},
 AWAKENING:{id:'AWAKENING',name:'SET 02 — AWAKENING',cards:SET_02_CARDS,leaders:SET_02_LEADERS,theme:'✨ Despertar'},
 SHADOWS:{id:'SHADOWS',name:'SET 03 — SHADOWS',cards:SET_03_CARDS,leaders:SET_03_LEADERS,theme:'🌑 Sombras del Infierno'},
 COLLISION:{id:'COLLISION',name:'SET 04 — COLLISION',cards:SET_04_CARDS,leaders:SET_04_LEADERS,theme:'💥 Combo'},
 RABBIT_HOLE:{id:'RABBIT_HOLE',name:'SET 05 — RABBIT HOLE',cards:SET_05_CARDS,leaders:SET_05_LEADERS,theme:'🐇 Sobrevive al borde de la derrota'}
};
GLTCG.SET_01=GLTCG.SETS.ORIGINS;GLTCG.SET_02=GLTCG.SETS.AWAKENING;GLTCG.SET_03=GLTCG.SETS.SHADOWS;GLTCG.SET_04=GLTCG.SETS.COLLISION;GLTCG.SET_05=GLTCG.SETS.RABBIT_HOLE;
