# Emmy DOM Roadmap

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

## Phase 5: Documentation and Adoption (P2)
- ✅ Publish roadmap and known limitations in main docs.
- ✅ Document "production-ready" criteria and compatibility.
- ✅ Add troubleshooting guide for SSR and exports.
- ⏳ Evaluate at architectural level whether overriding DOM globals (like `querySelector`) still makes sense, and explore less intrusive alternatives.

## Feature Status (Snapshot)
- ✅ Class Components: Stable
- ✅ Functional Components: Stable
- ✅ Declarative Props: Stable
- ✅ Emmy Hooks: Stable
- ✅ Auto-close Tags: Stable
- ✅ JSX in Client Components: Stable
- ✅ Emmy Router Routes: Stable
- ✅ Emmy Router SPA Navigation: Stable
- ❌ Prerendering: Unstable
- ⚠️ Server-side Rendering: Experimental

## Immediate Next Steps
1. Stabilize Prerendering.

## Success Criteria
- ✅ Zero incidents due to broken exports between consecutive versions.
- ✅ Reproducible releases with checklist and green CI.
- ✅ Reduction of SSR bugs and greater coverage of real-world scenarios.
