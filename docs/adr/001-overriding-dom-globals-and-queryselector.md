# ADR 001: Overriding DOM Globals and querySelector in Components

## Status
Accepted

## Context
Currently, Emmy.js components (`Component`, `LightComponent`, `FunctionalComponent`) override the natively inherited `this.querySelector` method. The current implementation converts PascalCase tag names to kebab-case web components automatically, and in functional components, it goes as far as monkey-patching the returned element's `addEventListener`. While this offers syntactic sugar for the developer, it breaks the principle of least astonishment. Patching native DOM APIs obscures native behavior, blocks third-party libraries that rely on standard `querySelector` signatures, and introduces potential memory leaks or unpredictable side effects when patching event listeners on the fly. 

## Decision
We evaluated the current architectural approach of overriding `querySelector` and other DOM globals/prototype methods. 

We conclude that **it no longer makes sense** to override native DOM APIs to provide framework magic. We must preserve standard web platform behavior at the component level to stay true to our goal: being a functional wrapper over standard Web Components.

## Less Intrusive Alternatives To Be Implemented
Instead of overriding `querySelector` in `EmmyComponent` subclasses, we will:
1. **Promote `useRef()` hook (or similar):** A standard, non-intrusive way to grab DOM node references in components without searching the DOM tree blindly.
2. **Provide utility functions:** e.g., a helper `emmyQuery(this, 'MyComponent')` or `$(this, 'MyComponent')` which can apply the PascalCase to kebab-case mapping and return elements cleanly without patching their native prototype.
3. **Deprecate the override:** In a future major release, we will remove the `querySelector` override entirely and deprecate it, routing users to proper hooks.

## Consequences
- Better compatibility with existing vanilla JS libraries.
- No unexpected event listener loops or performance penalties caused by monkey patching.
- Clearer separation of framework logic and underlying Web Component specs.
