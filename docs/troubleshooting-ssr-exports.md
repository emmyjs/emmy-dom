# Troubleshooting SSR y Exports

Guia rapida para resolver incidencias comunes en SSR y publicacion de paquete.

## 1) No se puede importar emmy-dom/server

Sintoma:
- Error al resolver el subpath `emmy-dom/server`.

Revision:
- Ejecuta `npm run verify:package-contract` para validar `exports`, `files` y `dist`.

## 2) Diferencias entre cliente y SSR

Sintoma:
- Un componente se comporta distinto en SSR.

Revision:
- `useEffect` no debe depender de servidor; su ejecucion se omite en SSR.
- Evita APIs del navegador en render SSR.

## 3) Router devuelve 404 inesperado

Sintoma:
- El router no encuentra una ruta valida.

Revision:
- Verifica `to` y `href` en `emmy-route`.
- La raiz `/` se mapea a `/root` internamente.

## 4) La web no refleja estado de features actualizado

Sintoma:
- Estado desfasado respecto del roadmap.

Revision:
- Regenera y valida JSON:
  - `npm run status:generate`
  - `npm run status:verify`

## 5) Fallo de build/release por contrato de paquete

Sintoma:
- CI falla en validacion de paquete.

Revision:
- Ejecuta localmente `npm run verify:package-contract`.
- Ajusta package exports/files y vuelve a validar.
# Troubleshooting SSR y Exports

Esta guia resume problemas comunes al usar `emmy-dom` en entornos SSR y en integraciones con bundlers.

## 1) Error al importar `emmy-dom/server`

Sintoma:
- El runtime no encuentra el subpath `emmy-dom/server`.

Verificacion:
- Revisa que la version publicada tenga el contrato correcto de `exports` y `files`.
- En este repo se valida con `npm run verify:package-contract`.

Accion:
- Asegura que tu instalacion este actualizada y limpia:
  - `rm -rf node_modules package-lock.json`
  - `npm install`
- Si persiste, verifica que tu bundler respete `package.json#exports`.

## 2) Diferencias entre cliente y SSR

Sintoma:
- El comportamiento de componentes cambia entre navegador y SSR.

Verificacion:
- Comprueba que la logica dependiente de navegador no se ejecute en servidor.
- Hooks como `useEffect` se omiten en servidor por diseno.

Accion:
- Mueve efectos de cliente a codigo que solo corra en browser.
- Evita acoplar render de SSR a APIs de `window` o `document` reales.

## 3) Router SSR/SPA no resuelve rutas esperadas

Sintoma:
- El router muestra `404` en rutas que deberian existir.

Verificacion:
- Revisa que los elementos `emmy-route` tengan `to` y `href` correctos.
- Para la raiz `/`, el sistema usa internamente la clave `/root`.

Accion:
- Declara ruta raiz explicitamente:
  - `<emmy-route to="Home" href="/"></emmy-route>`
- Comprueba que el componente referenciado este cargado con `load(...)`.

## 4) Feature status desactualizado en la web

Sintoma:
- La web muestra estados antiguos de features.

Verificacion:
- El estado se genera desde `ROADMAP.md` en `docs/feature-status.json`.

Accion:
- Regenera y verifica antes de commit:
  - `npm run status:generate`
  - `npm run status:verify`

## 5) Build/release falla por contrato de paquete

Sintoma:
- CI falla en validacion de paquete.

Verificacion:
- Se ejecuta `scripts/verify-package-contract.cjs` para validar `dist`, `exports` y archivos empaquetados.

Accion:
- Ejecuta localmente:
  - `npm run verify:package-contract`
- Si modificaste entradas de package, ajusta tambien tests y pipeline.
