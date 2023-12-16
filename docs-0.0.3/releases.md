# Release Notes

## 0.0.3
It includes the following features:
1. [Class Components](docs/0.0.3/docs.md)
2. [Light Components](docs/0.0.3/docs.md)
3. [Functional Components](docs/0.0.3/docs.md)
4. [Page Components](docs/0.0.3/docs.md)
5. [Emmy Hooks](docs/0.0.3/docs.md)
6. [Load Function](docs/0.0.3/docs.md)
7. [Emmy Router](docs/0.0.3/docs.md)
8. **BREAKING CHANGE**: Remove `git clone` support. Now you can use `npx create-emmy` to create a new emmy.js project.

## Release 0.0.3a1
It includes the following features:
1. [Component Class](docs/0.0.2a1/component-class.md)
2. [LightComponent Class](docs/0.0.2a1/light-component-class.md)
3. [Launch Function](docs/0.0.2a1/launch-function.md)
4. [Emmy Router](docs/0.0.3a1/emmy-router.md)
5. **BREAKING CHANGE**: Remove `git clone` support. Now you can use `npx create-emmy` to create a new emmy.js project.

## 0.0.2
It includes the following features:
1. [Component Class](docs/0.0.2a1/component-class.md)
2. [LightComponent Class](docs/0.0.2a1/light-component-class.md)
3. [Launch Function](docs/0.0.2a1/launch-function.md)
4. **BREAKING CHANGE**: The `emmy.js` file has been transformed into a module. Use the `import` statement to import the `Component` and `LightComponent` classes and the `launch` function.
5. **BREAKING CHANGE**: The `Component.content` property has been removed. Use the `Component.shadowRoot` property instead.

## 0.0.2a2
It includes the following features:
1. [Component Class](docs/0.0.2a1/component-class.md)
2. [LightComponent Class](docs/0.0.2a1/light-component-class.md)
3. [Launch Function](docs/0.0.2a1/launch-function.md)
4. **BREAKING CHANGE**: The `Component.content` property has been removed. Use the `Component.shadowRoot` property instead.

## 0.0.2a1
It includes the following features:
1. [Component Class](docs/0.0.2a1/component-class.md)
2. [LightComponent Class](docs/0.0.2a1/light-component-class.md)
3. [Launch Function](docs/0.0.2a1/launch-function.md)
4. `Component.behave` and `LightComponent.behave` methods for easily adding `is` attributes to the component's root element.
5. **BREAKING CHANGE**: The `emmy.js` file has been transformed into a module. Use the `import` statement to import the `Component` and `LightComponent` classes and the `launch` function.

## 0.0.1
First release version of Emmy.js, distributed as an npm package on [npmjs.com](https://www.npmjs.com/package/emmy-dom). It includes the following features:
1. [Component Class](docs/0.0.1a2/component-class.md) 
2. [Launch Function](docs/0.0.1a2/launch-function.md)

## 0.0.1a2
It includes the following features:
1. [Component Class](docs/0.0.1a2/component-class.md) 
2. [Launch Function](docs/0.0.1a2/launch-function.md)
3. **BREAKING CHANGE**: The `Component.newButton` method has been removed. Use the `callback` argument of the `Component.render` method instead.
4. **BREAKING CHANGE**: The style objects are no longer supported in `Component.addStyle` method. Use style strings instead.
5. **FIX**: The shadow DOM is now correctly updated when the `Component.render` method is called.

### Examples
1. [Counter](docs/0.0.1a2/examples/counter.md)

## 0.0.1a1
First pre-release version of Emmy.js. It includes the following features:
1. [Component Class](docs/0.0.1a1/component-class.md) 
2. [Launch Function](docs/0.0.1a1/launch-function.md)

### Examples
1. [Counter](docs/0.0.1a1/examples/counter.md)
