# Emmy.js

A tiny simple frontend framework for building web applications.

## Quick Start
### Using npm

First install the package:

```bash
npm install emmy-dom
```

Then, integrate it into your project. For your specific framework, see the following guides:
1. [Ruby on Rails](docs/0.0.2/guides/ruby-on-rails.md)

### Using git

First clone the repository:

```bash
git clone git@github.com:eanorambuena/Emmy.js.git
```

Then, launch a development server with your favorite tool. For example, with [http-server](https://www.npmjs.com/package/http-server):

That's it! You can now start building your application.

You will see the following on your browser:

![Alt text](docs/image.png)

## Release 0.0.2
It includes the following features:
1. [Component Class](docs/0.0.2a1/component-class.md)
2. [LightComponent Class](docs/0.0.2a1/light-component-class.md)
3. [Launch Function](docs/0.0.2a1/launch-function.md)
4. **BREAKING CHANGE**: The `emmy.js` file has been transformed into a module. Use the `import` statement to import the `Component` and `LightComponent` classes and the `launch` function.
5. **BREAKING CHANGE**: The `Component.content` property has been removed. Use the `Component.shadowRoot` property instead.

[Release Notes](docs/releases.md)