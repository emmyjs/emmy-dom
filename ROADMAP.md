
# Emmy DOM v2 Roadmap

## What's New in Version 2.0.0
Version 2.0.0 introduces major architectural changes, making the framework production-ready for Server-Side Rendering (SSR) and paving the way for static site generation.

### 🏝️ Astro-like Islands Architecture
Emmy DOM now supports **Partial Hydration (Islands Architecture)** for 100% static components. By assigning a `static` flag to your function components, you can completely opt-out of shipping Javascript to the browser for that component, drastically reducing the bundle size!
```typescript
export function underConstruction({ el }) {
  el.className = 'absolute inset-0 bg-gray-900 bg-opacity-90 flex flex-col justify-center items-center'
  return html`<div>Under construction</div>`
}
// Skips client-side hydration completely, leaving only raw HTML:
underConstruction.static = true
```


### 🏎️ Snel Engine: New SSR Render Engine
The new SSR engine is now officially named **Snel Engine** (Dutch for "fast").
We have successfully replaced the legacy experimental engine with a highly robust simulated DOM stringifier based on `undom`. Features include:
- Strict compliance with Web Components standard tags (`<emmy-app>`).
- 0% leakage of Node.js modules (like `fs`, `path`) into the frontend Vite client.
- Bulletproof state hydration via intelligent `patchState` synchronization.

#### Performance
In local profiling, Snel Engine achieves LCP (Largest Contentful Paint) ≈ 0.5s and total main thread work ≈ 3.2s (see attached Chrome DevTools trace). This demonstrates competitive speed for SSR hydration and initial load. Further optimizations are planned.

---

# Previous Roadmap

## Objective
Stabilize SSR and the package publishing contract, reduce regressions in releases, and improve clarity of use in production.

<details>
<summary><strong>✅ Phase 1: Release Stability (P0)</strong></summary>

- ✅ Define repository artifact policy (do not version generated coverage reports in the main branch).
- ✅ Strengthen npm publishing contract: validate `exports`, `files`, and final `dist` content in each release.
- ✅ Add `engines` in `package.json` to stick runtime baseline.
- ✅ Create a release checklist with mandatory verifications before publishing.
- ✅ Automate Copilot review requests on new PRs.
- ✅ Add a Copilot review gate before merge.
</details>

<details>
<summary><strong>✅ Phase 2: SSR Core (P0)</strong></summary>

- ✅ Implement `whatToShow` and `filter` in the SSR DOM `createTreeWalker`.
- ✅ Optimize `getElementById` (avoid linear search with an index/hash).
- ✅ Correct `TreeWalker` semantics according to review (gating by `whatToShow` + root validation).
- ✅ Resolve or isolate the `nodeName` loss issue related to dynamic imports.
- ✅ Review inheritance debt in `DocumentFragment` and cleanup of settable `nodeName`.
</details>

<details>
<summary><strong>✅ Phase 3: Typing and Compilation (P1)</strong></summary>

- ✅ Resolve TypeScript warning regarding `rootDir`/output layout.
- ✅ Stiffen TypeScript incrementally (`strict` in stages).
- ✅ Review compilation `target` to align with supported runtimes.
</details>

<details>
<summary><strong>✅ Phase 4: Tests and Quality (P1)</strong></summary>

- ✅ Deepen SSR tests (HTML structure, hydration, edge cases).
- ✅ Add behavior tests for functional components and hooks (re-render, state transitions, and edge cases).
- ✅ Define minimum coverage thresholds for critical SSR modules.
- ✅ Ensure 100% coverage on features marked as `Stable` (dedicated gate).
</details>

<details>
<summary><strong>✅ Phase 5: Documentation and Adoption (P2)</strong></summary>

- ✅ Publish roadmap and known limitations in main docs.
- ✅ Document "production-ready" criteria and compatibility.
- ✅ Add troubleshooting guide for SSR and exports.
- ✅ Evaluate at architectural level whether overriding DOM globals (like `querySelector`) still makes sense, and explore less intrusive alternatives.
</details>

## Feature Status (Snapshot)
- ✅ Class Components: Stable (100% Coverage)
- ✅ Functional Components: Stable (100% Coverage)
- ✅ Declarative Props: Stable (100% Coverage)
- ✅ Emmy Hooks: Stable (100% Coverage)
- ✅ Auto-close Tags: Stable (100% Coverage)
- ✅ JSX in Client Components: Stable (100% Coverage)
- ✅ Emmy Router Routes: Stable (100% Coverage)
- ✅ Emmy Router SPA Navigation: Stable (100% Coverage)
- ✅ Server-side Rendering: Stable (85% Coverage)

## Immediate Next Steps
1. Increase SSR real-world testing and documentation.

## Success Criteria
- ✅ Zero incidents due to broken exports between consecutive versions.
- ✅ Reproducible releases with checklist and green CI.
- ✅ Reduction of SSR bugs and greater coverage of real-world scenarios.
