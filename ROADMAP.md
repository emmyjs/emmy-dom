# Roadmap Emmy DOM

## Objetivo
Estabilizar SSR y el contrato de publicacion del paquete, reducir regresiones en releases y mejorar la claridad de uso en produccion.

## Fase 1: Estabilidad de release (P0)
- Definir politica de artefactos en repo (no versionar reportes generados de coverage en rama principal).
- Fortalecer contrato de publicacion npm: validar `exports`, `files` y contenido final de `dist` en cada release.
- Agregar `engines` en `package.json` para fijar baseline de runtime.
- Crear checklist de release con verificaciones obligatorias antes de publicar.

## Fase 2: SSR core (P0)
- Implementar `whatToShow` y `filter` en `createTreeWalker` del DOM SSR.
- Optimizar `getElementById` (evitar busqueda lineal con indice/hash).
- Resolver o aislar el caso de perdida de `nodeName` relacionado a imports dinamicos.
- Revisar deuda de herencia en `DocumentFragment` y limpieza de `nodeName` settable.

## Fase 3: Tipado y compilacion (P1)
- Resolver warning de TypeScript sobre `rootDir`/layout de salida.
- Endurecer TypeScript de manera incremental (`strict` por etapas).
- Revisar `target` de compilacion para alinearlo con runtimes soportados.

## Fase 4: Tests y calidad (P1)
- Profundizar tests SSR (estructura HTML, hidratacion, casos edge).
- Agregar tests de comportamiento en componentes funcionales y hooks.
- Definir umbrales minimos de coverage para modulos criticos SSR.

## Fase 5: Documentacion y adopcion (P2)
- Publicar roadmap y limitaciones conocidas en docs principales.
- Documentar criterios de "listo para produccion" y compatibilidad.
- Añadir guia de troubleshooting para SSR y exportaciones.

## Criterios de exito
- Cero incidentes por exports rotos entre versiones consecutivas.
- Releases reproducibles con checklist y CI en verde.
- Reduccion de bugs en SSR y mayor cobertura de escenarios reales.
