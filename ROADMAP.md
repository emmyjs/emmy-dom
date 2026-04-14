# Roadmap Emmy DOM

## Objetivo
Estabilizar SSR y el contrato de publicación del paquete, reducir regresiones en releases y mejorar la claridad de uso en producción.

## Fase 1: Estabilidad de release (P0)
- ✅ Definir política de artefactos en repo (no versionar reportes generados de coverage en rama principal).
- ✅ Fortalecer contrato de publicación npm: validar `exports`, `files` y contenido final de `dist` en cada release.
- ✅ Agregar `engines` en `package.json` para fijar baseline de runtime.
- ✅ Crear checklist de release con verificaciones obligatorias antes de publicar.
- ✅ Automatizar solicitud de review de Copilot en PRs nuevas.
- ✅ Agregar gate de revisión de Copilot antes de merge.

## Fase 2: SSR core (P0)
- ✅ Implementar `whatToShow` y `filter` en `createTreeWalker` del DOM SSR.
- ✅ Optimizar `getElementById` (evitar búsqueda lineal con índice/hash).
- ✅ Corregir semántica de `TreeWalker` según review (gating por `whatToShow` + validación de root).
- ⏳ Resolver o aislar el caso de pérdida de `nodeName` relacionado a imports dinámicos.
- ⏳ Revisar deuda de herencia en `DocumentFragment` y limpieza de `nodeName` settable.

## Fase 3: Tipado y compilación (P1)
- ✅ Resolver warning de TypeScript sobre `rootDir`/layout de salida.
- ✅ Endurecer TypeScript de manera incremental (`strict` por etapas).
- ✅ Revisar `target` de compilación para alinearlo con runtimes soportados.

## Fase 4: Tests y calidad (P1)
- ✅ Profundizar tests SSR (estructura HTML, hidratación, casos edge).
- ✅ Agregar tests de comportamiento en componentes funcionales y hooks (re-render, state transitions y edge cases).
- ✅ Definir umbrales mínimos de coverage para módulos críticos SSR.
- ✅ Asegurar coverage 100% en features marcadas como `Estable` (gate dedicado).

## Fase 5: Documentación y adopción (P2)
- ✅ Publicar roadmap y limitaciones conocidas en docs principales.
- ✅ Documentar criterios de "listo para producción" y compatibilidad.
- ✅ Añadir guía de troubleshooting para SSR y exportaciones.
- ⏳ Evaluate at architectural level whether overriding DOM globals (like `querySelector`) still makes sense, and explore less intrusive alternatives.

## Estado de Features (Snapshot)
- ✅ Class Components: Estable
- ✅ Functional Components: Estable
- ✅ Declarative Props: Estable
- ✅ Emmy Hooks: Estable
- ✅ Auto-close Tags: Estable
- ✅ JSX in Client Components: Estable
- ✅ Emmy Router Routes: Estable
- ✅ Emmy Router SPA Navigation: Estable
- ❌ Prerendering: Inestable
- ⚠️ Server-side Rendering: Experimental

## Próximos Pasos Inmediatos
1. Completar deuda SSR pendiente (`nodeName` dinámico y herencia de `DocumentFragment`).
2. Estabilizar Prerendering.

## Criterios de éxito
- Cero incidentes por exports rotos entre versiones consecutivas.
- Releases reproducibles con checklist y CI en verde.
- Reducción de bugs en SSR y mayor cobertura de escenarios reales.
