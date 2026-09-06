from pathlib import Path
import re
root=Path(__file__).parent
cards=(root/'js/cards.js').read_text(encoding='utf-8')
game=(root/'js/game.js').read_text(encoding='utf-8')
ids=re.findall(r"\{id:'(T\d+)'",cards)
leaders=re.findall(r"\{id:'(T0[1-7])'",cards)
assert leaders==[f'T0{i}' for i in range(1,8)], leaders
assert [x for x in ids if int(x[1:]) >= 8] == [f'T{i:02d}' for i in range(8,61)], (ids[:3],ids[-3:],len(ids))
assert len(set(ids))==60
assert "LOS_KOREANOS_DEL_FIN" in cards
assert "Canto Infernal" in cards and "resolveCantoRoll" in game
assert "cantoUsedP1" in game and "cantoUsedP2" in game
assert "SET 07 · Los KoreanOS del Fin" in (root/'index.html').read_text(encoding='utf-8')
print('SET 07 OK: 7 líderes + 53 cartas = 60 cartas totales; Canto Infernal integrado; filtros/catálogo actualizados.')
