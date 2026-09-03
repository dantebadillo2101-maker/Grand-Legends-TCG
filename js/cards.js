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



// SET 02 — AWAKENING
const SET_02_LEADERS=[
{id:'A01',name:'Aeron, Heraldo del Despertar',art:'🌅',color:'Rojo',life:5,ability:'Una vez por turno: cuando uno de tus personajes despierte, dale +500 este turno.'},
{id:'A02',name:'Selene, Oráculo del Vacío',art:'🌌',color:'Azul',life:5,ability:'Una vez por turno: al activar Despertar, mira las 2 primeras cartas y reordénalas.'},
{id:'A03',name:'Ragnar, Rey de la Llama',art:'🔥',color:'Verde',life:5,ability:'Tus personajes Despertados con 2+ DON ganan +300 poder.'},
{id:'A04',name:'Nyx, Soberana del Eclipse',art:'🌑',color:'Púrpura',life:5,ability:'Una vez por turno: cuando uno de tus personajes sea derrotado, recupera 1 DON usado.'}
];
const SET_02_CARDS=[
['A05','Aprendiz del Despertar',1,500,'Personaje','🌄','Despertar con 3+ DON: +300 este turno.','awakening300','Común'],
['A06','Explorador del Umbral',2,700,'Personaje','🔭','Al entrar: mira las 2 primeras cartas.','peek2','Común'],
['A07','Guardia de la Aurora',2,900,'Personaje','🛡️','🛡️ BLOCKER.','blocker','Común'],
['A08','Lobo Despertado',2,1000,'Personaje','🐺','Despertado: +300 poder.','awakening300','Común'],
['A09','Guerrero del Eclipse',3,1200,'Personaje','🌘','Al ser derrotado: recupera 1 DON usado.','donRecover','Rara'],
['A10','Arquera del Alba',2,800,'Personaje','🏹','Al entrar: enemigo -300 este turno.','debuff300','Común'],
['A11','Monje del Umbral',3,1000,'Personaje','🧘','Despertar: roba 1 carta.','awakeningDraw','Rara'],
['A12','Bestia de Cristal',3,1300,'Personaje','💎','Si otro personaje está Despertado, +200.','awakening200','Rara'],
['A13','Centinela Astral',4,1600,'Personaje','✨','🛡️ BLOCKER.','blocker','Rara'],
['A14','Caballero Renacido',4,1800,'Personaje','⚔️','Despertar: +500 este turno.','awakening500','Rara'],
['A15','Dragón del Despertar',5,2300,'Personaje','🐉','Despertar: +700 este turno.','awakening700','Súper Rara'],
['A16','Guardiana del Umbral',4,1500,'Personaje','🌙','Cuando otro despierte, dale +300 este turno.','onOtherAwaken','Rara'],
['A17','Titán de la Aurora',5,2500,'Personaje','🗿','Con 3+ DON: +500 poder.','don3bonus','Súper Rara'],
['A18','Cazador del Eclipse',3,1400,'Personaje','🏹','Al derrotar un personaje: mira 1 carta de la mano rival.','peekHand','Rara'],
['A19','Fénix Renacido',5,2100,'Personaje','🔥','Al ser derrotado: vuelve a tu mano si Despertar está activo.','phoenixReturn','Súper Rara'],
['A20','Maestro de los Sellos',4,1300,'Personaje','🔮','Despertar: desactiva un efecto temporal enemigo.','sealBreak','Rara'],
['A21','Bestia Primordial',6,2700,'Personaje','🦖','Despertar: +1000 este turno.','awakening1000','Súper Rara'],
['A22','Espadachín del Vacío',4,1900,'Personaje','🗡️','Si tienes menos cartas en mano que el rival: +500.','handBonus','Súper Rara'],
['A23','Dragón Celestial',6,3000,'Personaje','🐲','Despertar: derrota enemigo de 1500 o menos.','ko1500','Ultra Rara'],
['A24','Reina de las Estrellas',5,2200,'Personaje','👑','Al despertar: roba 2 y descarta 1.','draw2Discard','Súper Rara'],
['A25','Coloso del Eclipse',7,3500,'Personaje','🌑','No puede atacar al entrar; Despertar: puede atacar inmediatamente.','awakeningReady','Ultra Rara'],
['A26','Guerrero de la Primera Llama',6,2800,'Personaje','🔥','Cada DON que recibe le da +200 este turno.','donAttach200','Súper Rara'],
['A27','Oráculo Despierto',5,1600,'Personaje','🔮','Una vez por turno: mira las 3 primeras y reordénalas.','oracle3','Súper Rara'],
['A28','Fénix de la Segunda Era',7,3000,'Personaje','🪽','Al ser derrotado: recupera hasta 2 cartas del cementerio a la mano.','recover2','Ultra Rara'],
['A29','Avatar del Despertar',8,4000,'Personaje','🌟','Despertar: +1500 y puede atacar a un personaje preparado.','awakening1500','Ultra Rara'],
['A30','Rey del Vacío',8,3800,'Personaje','👑','Despertar: devuelve hasta 2 enemigos de coste 4 o menos a la mano.','bounce2','Ultra Rara'],
['A31','Dragón de la Primera Luz',9,4500,'Personaje','☀️','Despertar: roba 3 cartas.','draw3','Ultra Rara'],
['A32','Soberano de las Eras',10,5000,'Personaje','⏳','Una vez por turno: reactiva un efecto Despertar de un personaje.','repeatAwakening','Legendaria'],
['A33','Primer Despertar',1,0,'Evento','✨','Activa inmediatamente el Despertar de un personaje.','triggerAwakening','Común'],
['A34','Llamado de la Aurora',2,0,'Evento','🌅','Un personaje gana +700 este turno.','boost700','Común'],
['A35','Ruptura del Sello',3,0,'Evento','⛓️','Un enemigo pierde sus habilidades este turno.','sealBreak','Rara'],
['A36','Eclipse Total',4,0,'Evento','🌑','Enemigo -1000; si está Despertado, -500 adicional.','eclipseDebuff','Rara'],
['A37','Renacer',4,0,'Evento','🪽','Recupera un personaje de coste 3 o menos del cementerio.','recover','Súper Rara'],
['A38','Sobrecarga Astral',3,0,'Evento','⚡','Un personaje recibe 2 DON extra este turno.','extraDon2','Súper Rara'],
['A39','Fragmento del Despertar',1,0,'Recurso','💠','Roba 1 carta.','draw','Común'],
['A40','Núcleo Primordial',2,0,'Recurso','🔋','Recupera 1 DON usado.','donRecover','Rara']
];
const AWAKENING=SET_02_CARDS.map((x)=>({id:x[0],name:x[1],cost:x[2],power:x[3],type:x[4],art:x[5],ability:x[6],effect:x[7],rarity:x[8],set:'AWAKENING',traits:['Despertar']}));

// SET 03 — SHADOWS
const SET_03_LEADERS=[
{id:'S01',name:'Varek, Señor de las Sombras',art:'🌑',color:'Púrpura',life:5,ability:'Una vez por turno: cuando uno de tus personajes sea derrotado, otro gana +500 este turno.'},
{id:'S02',name:'Morgana, Reina del Cementerio',art:'💀',color:'Azul',life:5,ability:'Una vez por turno: cuando recuperes una carta de un cementerio, roba 1 y descarta 1.'},
{id:'S03',name:'Drazek, Heraldo Infernal',art:'🔥',color:'Rojo',life:5,ability:'Una vez por turno: cuando un personaje tuyo derrote a otro, gana +700 este turno.'},
{id:'S04',name:'Erebus, Guardián del Abismo',art:'🕳️',color:'Verde',life:5,ability:'Los personajes que regresaron del cementerio ganan +300 mientras estén en campo.'}
];
const SET_03_CARDS=[
['S05','Espectro del Abismo',1,500,'Personaje','👻','Al ser derrotado: mira la primera carta del mazo.','peek1','Común'],
['S06','Caminante de Sombras',2,700,'Personaje','🌫️','Con 3+ cartas en tu cementerio: +300.','grave3bonus','Común'],
['S07','Guardián Sepulcral',2,900,'Personaje','🛡️','🛡️ BLOCKER.','blocker','Común'],
['S08','Lobo Infernal',2,1000,'Personaje','🐺','Cuando otro aliado sea derrotado: +300 este turno.','allyKO300','Común'],
['S09','Sacerdote de las Sombras',3,900,'Personaje','🧙','Al entrar: recupera 1 carta del cementerio a tu mano.','recover','Rara'],
['S10','Cazadora Nocturna',2,800,'Personaje','🏹','Al entrar: enemigo -300.','debuff300','Común'],
['S11','Guerrero Maldito',3,1300,'Personaje','⚔️','Si fue recuperado del cementerio: +500.','recovered500','Rara'],
['S12','Bestia del Abismo',3,1400,'Personaje','🦴','Con 5+ cartas en cementerio: +300.','grave5bonus','Rara'],
['S13','Caballero de la Tumba',4,1700,'Personaje','⚰️','Al ser derrotado: recupera 1 DON usado.','donRecover','Rara'],
['S14','Demonio de Ceniza',4,1800,'Personaje','😈','Al derrotar un personaje: mira 1 carta de la mano rival.','peekHand','Rara'],
['S15','Dragón Infernal',5,2300,'Personaje','🐉','Si otro personaje fue derrotado este turno: +700.','allyKOBonus700','Súper Rara'],
['S16','Reina de los Espectros',4,1500,'Personaje','👑','Al entrar: recupera personaje de coste 2 o menos.','recoverCost2','Súper Rara'],
['S17','Titán del Abismo',5,2500,'Personaje','🗿','Con 7+ cartas en cementerio: +500.','grave7bonus','Súper Rara'],
['S18','Asesino del Vacío',3,1400,'Personaje','🗡️','Al derrotar personaje: rival descarta 1.','oppDiscard','Rara'],
['S19','Fénix Oscuro',5,2100,'Personaje','🔥','Al ser derrotado: puede volver a tu mano.','phoenixReturn','Súper Rara'],
['S20','Maestro de las Sombras',4,1300,'Personaje','🎭','Una vez por turno: sacrifica un personaje para robar 1.','sacrificeDraw','Rara'],
['S21','Bestia Primordial Oscura',6,2800,'Personaje','🦖','Con 8+ cartas en cementerio: +500.','grave8bonus','Súper Rara'],
['S22','Espadachín Maldito',4,1900,'Personaje','⚔️','Si tienes menos cartas en mano que el rival: +500.','handBonus','Súper Rara'],
['S23','Dragón de las Tinieblas',6,3000,'Personaje','🐲','Al entrar: derrota enemigo de 1500 o menos.','ko1500','Ultra Rara'],
['S24','Reina del Abismo',5,2200,'Personaje','👸','Al ser recuperada: roba 2 y descarta 1.','draw2Discard','Súper Rara'],
['S25','Coloso de las Sombras',7,3500,'Personaje','🌑','No puede atacar al entrar; si fue recuperado, puede atacar.','recoveredReady','Ultra Rara'],
['S26','Guerrero del Último Aliento',6,2800,'Personaje','💀','Cuando otro aliado sea derrotado: +200 mientras esté en campo.','allyKO200','Súper Rara'],
['S27','Oráculo del Más Allá',5,1600,'Personaje','🔮','Una vez por turno: mira las 3 primeras y reordénalas.','oracle3','Súper Rara'],
['S28','Fénix del Inframundo',7,3000,'Personaje','🔥','Al ser derrotado: recupera hasta 2 cartas del cementerio.','recover2','Ultra Rara'],
['S29','Avatar Infernal',8,4000,'Personaje','👹','Cuando otro personaje sea derrotado: +500 este turno.','allyKO500','Ultra Rara'],
['S30','Rey del Abismo',8,3800,'Personaje','👑','Al entrar: devuelve hasta 2 enemigos de coste 4 o menos.','bounce2','Ultra Rara'],
['S31','Dragón de la Noche Eterna',9,4500,'Personaje','🐉','Al entrar: recupera hasta 2 personajes del cementerio a la mano.','recover2','Ultra Rara'],
['S32','Soberano del Inframundo',10,5000,'Personaje','☠️','Una vez por turno: reactiva un efecto de Último Aliento.','repeatKO','Legendaria'],
['S33','Pacto de las Sombras',1,0,'Evento','📜','Derrota uno de tus personajes y roba 2.','sacrificeDraw2','Común'],
['S34','Regreso del Más Allá',2,0,'Evento','🌀','Recupera personaje de coste 3 o menos.','recoverCost3','Rara'],
['S35','Maldición Infernal',3,0,'Evento','☠️','Enemigo pierde habilidades este turno y -700.','curse700','Rara'],
['S36','Juicio de las Sombras',4,0,'Evento','⚖️','Derrota enemigo de 1800 o menos; con 5+ cementerio, hasta 2200.','shadowKO','Súper Rara'],
['S37','Último Suspiro',4,0,'Evento','💨','Cuando tu personaje sea derrotado, puedes jugar uno de coste 3 o menos pagando 1 DON extra.','lastBreath','Súper Rara'],
['S38','Fragmento del Abismo',1,0,'Recurso','💠','Roba 1; con 5+ cartas en cementerio, recupera 1 DON usado.','shadowDraw','Común'],
['S39','Alma Condenada',2,0,'Recurso','👁️','Recupera personaje de coste 2 o menos.','recoverCost2','Rara'],
['S40','Portal del Inframundo',4,0,'Recurso','🌀','Recupera hasta 2 personajes de coste 4 o menos.','recover2','Ultra Rara']
];
const SHADOWS=SET_03_CARDS.map((x)=>({id:x[0],name:x[1],cost:x[2],power:x[3],type:x[4],art:x[5],ability:x[6],effect:x[7],rarity:x[8],set:'SHADOWS',traits:['Sombras']}));

// SET 04 — COLLISION
const SET_04_LEADERS=[
{id:'C41',name:'Raze, Guerrero de la Colisión',art:'💥',color:'Rojo',life:5,ability:'Una vez por turno: cuando uno de tus personajes ataque, si tienes Combo 2+, dale +500 durante ese combate.'},
{id:'C42',name:'Mira, Estratega del Vórtice',art:'🌀',color:'Azul',life:5,ability:'Una vez por turno: al alcanzar Combo 3, mira las 3 primeras cartas y reordénalas.'},
{id:'C43',name:'Torak, Titán del Impacto',art:'🗿',color:'Verde',life:5,ability:'Tus personajes con 2+ DON ganan +300. Al alcanzar Combo 4, uno gana +500 adicional.'},
{id:'C44',name:'Veyra, Reina del Combo',art:'⚡',color:'Púrpura',life:5,ability:'Una vez por turno: cuando una carta active Combo 3+, recupera 1 DON usado.'},
{id:'C45',name:'Solen, Maestro de la Resonancia',art:'☀️',color:'Amarillo',life:5,ability:'Una vez por turno: al alcanzar Combo 2, roba 1 y descarta 1.'}
];
const SET_04_CARDS=[
['C46','Aprendiz del Impacto',1,500,'Personaje','💥','Combo 2: +300 este turno.','combo300','Común'],
['C47','Corredora del Vórtice',1,400,'Personaje','💨','Combo 2: mira la primera carta del mazo.','comboPeek','Común'],
['C48','Guardia de Resonancia',2,900,'Personaje','🛡️','🛡️ BLOCKER.','blocker','Común'],
['C49','Luchador de la Cadena',2,1000,'Personaje','⛓️','Combo 2: +300 este turno.','combo300','Común'],
['C50','Arquera del Vórtice',2,800,'Personaje','🏹','Al entrar: enemigo -300 este turno.','debuff300','Común'],
['C51','Monje de la Colisión',3,1100,'Personaje','🧘','Combo 3: roba 1.','comboDraw','Rara'],
['C52','Bestia de Resonancia',3,1400,'Personaje','🐺','Combo 2: +300 este turno.','combo300','Rara'],
['C53','Caballero del Impacto',4,1800,'Personaje','⚔️','Combo 3: +500 este turno.','combo500','Rara'],
['C54','Cazador del Vórtice',3,1300,'Personaje','🎯','Combo 3: mira 1 carta de la mano rival.','comboPeekHand','Rara'],
['C55','Guardián de la Cadena',4,1600,'Personaje','🛡️','🛡️ BLOCKER. Combo 4: +500 este turno.','comboBlocker','Rara'],
['C56','Dragón de la Colisión',5,2300,'Personaje','🐉','Combo 3: +700 este turno.','combo700','Súper Rara'],
['C57','Reina de Resonancia',5,2100,'Personaje','👑','Combo 3: roba 2 y descarta 1.','comboDraw2Discard','Súper Rara'],
['C58','Titán del Vórtice',6,2800,'Personaje','🗿','Combo 4: +700 este turno.','combo700','Súper Rara'],
['C59','Espadachín de la Tormenta',4,1900,'Personaje','🗡️','Si tienes menos cartas en mano que el rival: +500.','handBonus','Rara'],
['C60','Fénix de la Cadena',5,2200,'Personaje','🔥','Combo 4: puede atacar inmediatamente.','comboReady','Súper Rara'],
['C61','Maestro de los Impactos',4,1500,'Personaje','🥋','Combo 2: otro personaje +500 este turno.','comboOther500','Rara'],
['C62','Bestia del Vórtice',5,2400,'Personaje','🦁','Combo 3: enemigo -500 este turno.','comboDebuff500','Súper Rara'],
['C63','Caballero de la Resonancia',5,2500,'Personaje','✨','Combo 4: recupera 1 DON usado.','comboDonRecover','Súper Rara'],
['C64','Dragón del Combo',6,3000,'Personaje','🐲','Combo 3: +500; Combo 5: +500 adicional.','combo500x2','Ultra Rara'],
['C65','Coloso del Impacto',7,3500,'Personaje','💢','No puede atacar al entrar; Combo 4: puede atacar.','comboReady','Ultra Rara'],
['C66','Oráculo de la Cadena',5,1600,'Personaje','🔮','Una vez por turno: mira las 3 primeras y reordénalas.','oracle3','Súper Rara'],
['C67','Guerrero del Último Combo',6,2900,'Personaje','⚡','Si alcanzas Combo 5: +1000 este turno.','combo1000','Ultra Rara'],
['C68','Fénix de la Resonancia',7,3100,'Personaje','🔥','Al ser derrotado: recupera 2 cartas del cementerio a la mano.','recover2','Ultra Rara'],
['C69','Avatar de la Colisión',8,4000,'Personaje','👹','Combo 4: +1000 y puede atacar un personaje preparado.','combo1000Ready','Ultra Rara'],
['C70','Soberano del Combo',10,5000,'Personaje','👑','Una vez por turno: repite un efecto Combo 3 o menor de un personaje.','repeatCombo','Legendaria'],
['C71','Primer Impacto',1,0,'Evento','💥','Un personaje gana +500. Combo 2: +300 adicional.','comboEvent800','Común'],
['C72','Cadena Relámpago',1,0,'Evento','⚡','Roba 1. Combo 3: roba 1 adicional y descarta 1.','comboDraw','Común'],
['C73','Golpe del Vórtice',2,0,'Evento','🌀','Un enemigo pierde 700 este turno.','debuff700','Común'],
['C74','Resonancia Total',2,0,'Evento','✨','Un personaje gana +1000. Combo 3: puede atacar inmediatamente.','comboEventReady','Rara'],
['C75','Rompeformaciones',3,0,'Evento','💢','Desactiva habilidades de un personaje enemigo este turno.','sealBreak','Rara'],
['C76','Doble Impacto',2,0,'Evento','⚔️','Uno de tus personajes puede realizar un segundo ataque este turno. Combo 4: +500 durante ese ataque.','secondAttack','Rara'],
['C77','Vórtice Inverso',3,0,'Evento','🌪️','Devuelve a la mano un enemigo de coste 4 o menos.','bounce4','Rara'],
['C78','Sobrecarga de Combo',3,0,'Evento','🔋','Aumenta inmediatamente tu Combo en 2.','comboPlus2','Súper Rara'],
['C79','Colisión Suprema',4,0,'Evento','💥','Un personaje gana +1500. Combo 4: puede atacar al Líder.','comboEvent1500','Súper Rara'],
['C80','Cadena Destructiva',4,0,'Evento','⛓️','Derrota enemigo de 1800 o menos. Combo 5: límite 2500.','comboKO','Súper Rara'],
['C81','Resonancia Temporal',2,0,'Evento','⌛','Reutiliza una habilidad activada este turno.','repeatEffect','Rara'],
['C82','Impacto Final',5,0,'Evento','💣','Enemigo -1500. Combo 4: si queda en 1500 o menos, es derrotado.','comboFinal','Ultra Rara'],
['C83','Tormenta de Colisión',5,0,'Evento','🌩️','Todos los enemigos -700. Combo 5: pierden habilidades este turno.','stormCombo','Ultra Rara'],
['C84','Combo Infinito',6,0,'Evento','♾️','Tu Combo cuenta +3 para los efectos de tus cartas este turno.','comboPlus3','Ultra Rara'],
['C85','Golpe de la Leyenda',7,0,'Evento','👑','Un personaje gana +2000. Combo 5: después de atacar puede volver a prepararse.','legendCombo','Legendaria'],
['C86','Fragmento de Resonancia',1,0,'Recurso','💠','Roba 1.','draw','Común'],
['C87','Núcleo del Vórtice',1,0,'Recurso','🌀','Combo +1.','comboPlus1','Común'],
['C88','Cristal de Impacto',2,0,'Recurso','💎','Recupera 1 DON usado.','donRecover','Rara'],
['C89','Motor de Cadena',2,0,'Recurso','⚙️','Roba 2 y descarta 1.','draw2Discard','Rara'],
['C90','Núcleo de Colisión',3,0,'Recurso','🔷','Un personaje gana +500 este turno.','boost500','Rara'],
['C91','Fragmento del Combo',3,0,'Recurso','⚡','Combo +2.','comboPlus2','Súper Rara'],
['C92','Reactor de Resonancia',4,0,'Recurso','🔋','Recupera 2 DON usados.','donRecover2','Súper Rara'],
['C93','Corazón del Vórtice',4,0,'Recurso','❤️','Roba 3 y descarta 1.','draw3Discard','Ultra Rara'],
['C94','Motor de la Primera Colisión',5,0,'Recurso','💥','Combo +3.','comboPlus3','Ultra Rara'],
['C95','Núcleo de la Leyenda',6,0,'Recurso','👑','Roba 4 cartas y recupera 2 DON usados.','legendResource','Legendaria']
];
const COLLISION=SET_04_CARDS.map((x)=>({id:x[0],name:x[1],cost:x[2],power:x[3],type:x[4],art:x[5],ability:x[6],effect:x[7],rarity:x[8],set:'COLLISION',traits:['Combo']}));

const ORIGINS=SET_01_CARDS.map(c=>({...c,set:'ORIGINS'}));
GLTCG.LEADERS=[...SET_01_LEADERS,...SET_02_LEADERS,...SET_03_LEADERS,...SET_04_LEADERS];
GLTCG.CARD_LIBRARY=[...ORIGINS,...AWAKENING,...SHADOWS,...COLLISION];
GLTCG.SET_01={id:'ORIGINS',name:'SET 01 — ORIGINS',cards:ORIGINS,leaders:SET_01_LEADERS};
GLTCG.SET_02={id:'AWAKENING',name:'SET 02 — AWAKENING',cards:AWAKENING,leaders:SET_02_LEADERS};
GLTCG.SET_03={id:'SHADOWS',name:'SET 03 — SHADOWS',cards:SHADOWS,leaders:SET_03_LEADERS};
GLTCG.SET_04={id:'COLLISION',name:'SET 04 — COLLISION',cards:COLLISION,leaders:SET_04_LEADERS};
GLTCG.SETS=[GLTCG.SET_01,GLTCG.SET_02,GLTCG.SET_03,GLTCG.SET_04];
