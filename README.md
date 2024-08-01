<section align="center" style="display: flex; flex-direction: column">
  <h1>Emmy.js</h1>
  <div>
    <a href="https://github.com/firstcontributions/open-source-badges" alt="Open Source Love"><img src="https://firstcontributions.github.io/open-source-badges/badges/open-source-v1/open-source.svg" />
    </a>
    <img alt="version" src="https://img.shields.io/npm/v/emmy-dom"/>
    <img alt="downloads" src="https://img.shields.io/npm/dt/emmy-dom"/>
    <img alt="minified + gzipped" src="https://img.shields.io/bundlephobia/minzip/emmy-dom"/>
    <img alt="license" src="https://img.shields.io/npm/l/emmy-dom"/>
    <img alt="github last commit" src="https://img.shields.io/github/last-commit/emmyjs/emmy-dom"/>
    <img alt="tests" src="https://github.com/emmyjs/emmy-dom/actions/workflows/vitest.yml/badge.svg"/>
  </div>
  <i>A tiny simple way for building web user interfaces using functional Web Components</i>
</section>
<hr />

## Why Emmy.js?
Emmy.js is a tiny simple way for building web user interfaces using functional Web Components. It is based on the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard.
It is specially designed for building web applications with server-side frameworks like Ruby on Rails, Django, Laravel, etc. [More info](https://emmyjs.pages.dev/getting-started)

<hr />

> [!NOTE]
> Emmy.js is still in an experimental phase, so it is not recommended to use it in production, but you can try it out and give us your feedback.

## `npx create-emmy`

[create-emmy](https://www.npmjs.com/package/create-emmy) is a command line tool that allows you to create a new Emmy.js project. [More info](https://github.com/emmyjs/create-emmy#readme)

> [!TIP]
> create-emmy 0.2.2 is now here! Try prerendering in a Vanilla Emmy app now!
> In order to create a new Emmy.js project, you can run the following command and follow the instructions:
> `npx create-emmy`

## Frameworks Guides
For your specific framework, see the following guides:
1. [Ruby on Rails](https://emmyjs.pages.dev/documentation/rails)
2. [Vite](https://emmyjs.pages.dev/documentation/vite)

## Quick Start
### Installation
#### Using CDN
Just add the following script tag to your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/emmy-dom@latest" type="module"></script>
```

This option is recommended for quick testing, but it will not allow you to use the pre-rendering feature.

#### Using npm
First install the package:

```bash
npm install emmy-dom
```

### Usage 

Then, use the `emmy-dom` package in your JavaScript files:

```javascript
import { load, html } from 'emmy-dom'

const myComponent = () => html`
  <div>Hello World!</div>
`

load(myComponent, 'MyComponent')
```

## Documentation
You can find the documentation [here](https://emmyjs.pages.dev/documentation).

[Tutorial](https://www.youtube.com/watch?v=rOxAJ9c068c)

## Contributing
We are open to contributions. If you want to contribute, please read the [contributing guide](CONTRIBUTING.md).

## License
Emmy.js is licensed under the [MIT License](LICENSE).

## Features
1. [Class Components](https://emmyjs.pages.dev/documentation)
2. [Functional Components](https://emmyjs.pages.dev/documentation)
3. [Page Components](https://emmyjs.pages.dev/documentation)
4. [Emmy Hooks](https://emmyjs.pages.dev/documentation)
5. [Emmy Router](https://emmyjs.pages.dev/documentation)
6. [Pre-rendering](https://emmyjs.pages.dev/documentation)
8. [Compatibility with server-side frameworks](https://emmyjs.pages.dev/documentation)
