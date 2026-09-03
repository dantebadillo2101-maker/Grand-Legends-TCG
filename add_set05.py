from pathlib import Path
p=Path('/mnt/data/legends_build/js/cards.js')
s=p.read_text()
insert=r'''

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
'''
# replace final ALL definitions section
marker='const ALL_LEADERS=[...SET_01_LEADERS,...SET_02_LEADERS,...SET_03_LEADERS,...SET_04_LEADERS];'
idx=s.index(marker)
# Keep everything before old final section, but remove old final section entirely
s=s[:idx]+insert
p.write_text(s)
print('cards.js updated', len(s.splitlines()), 'lines')
