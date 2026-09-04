# Grand Legends TCG — Web 

Primera build preparada para publicarse como sitio web estático.
# avisos importantes
se estaran haciendo actualizaciones cada cierto tiempo ademas , en las cuales se podra observar si se agrego un nuevo set de cartas o si se agrego un nuevo modo o si porfin se rehabilito el modo online , dejen sugerencias

## Contenido
- SET 01 — Origins
- SET 02 — Awakening
- SET 03 — Shadows
- SET 04 - Collision
- SET 05 - RABBIT HOLE
- VS IA
- 2 jugadores local
- Deck Builder
- Packs
- Cuentas locales mediante localStorage
- Online desactivado temporalmente
- Pruebas de reglas en `tests/rules.test.js`

## Pruebas

Con Node.js instalado, ejecuta `node tests/rules.test.js` desde la raiz del proyecto.

La persistencia usa migraciones versionadas mediante `GLTCG_STORAGE_SCHEMA`.

## Publicación
Esta carpeta está preparada para GitHub Pages. El archivo `index.html` debe quedar en la raíz del repositorio publicado.

## Versión
6.3.3
