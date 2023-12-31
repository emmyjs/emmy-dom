<section align="center" style="display: flex; flex-direction: column">
  <h1>Emmy.js</h1>
  <div>
    <a href="https://github.com/firstcontributions/open-source-badges" alt="Open Source Love"><img src="https://firstcontributions.github.io/open-source-badges/badges/open-source-v1/open-source.svg" />
    </a>
    <img alt="version" src="https://img.shields.io/npm/v/emmy-dom"/>
    <img alt="downloads" src="https://img.shields.io/npm/dt/emmy-dom"/>
    <img alt="license" src="https://img.shields.io/npm/l/emmy-dom"/>
    <img alt="github last commit" src="https://img.shields.io/github/last-commit/emmyjs/emmy-dom"/>
    <img alt="tests" src="https://github.com/emmyjs/emmy-dom/actions/workflows/vitest.yml/badge.svg"/>
  </div>
  <i>A tiny simple way for building web user interfaces</i>
</section>
<hr />

## Why Emmy.js?
Emmy.js is a tiny simple way for building web user interfaces. It is based on the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard.
It is specially designed for building web applications with server-side frameworks like Ruby on Rails, Django, Laravel, etc.

<hr />

> [!NOTE]
> Emmy.js is still in an experimental phase, so it is not recommended to use it in production, but you can try it out and give us your feedback.

## `npx create-emmy`

[create-emmy](https://www.npmjs.com/package/create-emmy) is a command line tool that allows you to create a new Emmy.js project. [More info](https://github.com/emmyjs/create-emmy#readme)

> [!TIP]
> create-emmy 0.1.0 is now here! Try prerendering in a Vanilla Emmy app now!
> In order to create a new Emmy.js project, you can run the following command and follow the instructions:
> `npx create-emmy`

## Frameworks Guides
For your specific framework, see the following guides:
1. [Ruby on Rails](docs-0.0.3/0.0.2/guides/ruby-on-rails.md)

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
import { load, html } from "emmy-dom";

const myComponent = () =>  {
  return html`<div>Hello World!</div>`;
}

load(myComponent, 'MyComponent');
```

## Documentation
You can find the documentation [here](docs-0.0.3/0.0.3/docs.md).

[Tutorial](https://www.youtube.com/watch?v=rOxAJ9c068c)

## Contributing
We are open to contributions. If you want to contribute, please read the [contributing guide](CONTRIBUTING.md).

## License
Emmy.js is licensed under the [MIT License](LICENSE).

## Release 1.0.0
It includes the following features:
1. [Class Components](docs/1.0.0.md)
2. [Functional Components](docs/1.0.0.md)
3. [Page Components](docs/1.0.0.md)
4. [Emmy Hooks](docs/1.0.0.md)
5. [Emmy Router](docs/1.0.0.md)
6. [Pre-rendering](docs/1.0.0.md)
7. [Compatibility with server-side frameworks](docs/1.0.0.md)

**Breaking changes:**
1. `behave` method is no longer supported, use the platform `is` attribute instead.
2. Now `this` is not an argument of the functional components. If you want to access the `this` object, you can use the `function` keyword instead of the arrow function, or the use the `el` attribute of the argument.
