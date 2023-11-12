const reactToCSS = require('react-style-object-to-css');
function processGenerator(generator) {
    let processedGenerator = generator.replace(/<\/?[^>]+>/g, match => {
        let element = match.slice(0, -1);
        if (/^[A-Z]/.test(match.slice(1, -1))) {
            let name = element.split(' ')[0].slice(1);
            let attributes = element.split(' ').slice(1);
            return `<emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        else if (/^[A-Z]/.test(match.slice(2, -2))) {
            let name = element.split(' ')[0].slice(2);
            let attributes = element.split(' ').slice(1);
            return `</emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        return match;
    });
    return processedGenerator;
}
function parseCSS(cssString) {
    const styleObj = {};
    cssString.split(';').forEach((declaration) => {
        const [property, value] = declaration.split(':');
        if (property && value) {
            styleObj[property.trim()] = value.trim();
        }
    });
    return styleObj;
}
function createInlineStyle(cssString) {
    if (typeof cssString !== 'string')
        return reactToCSS(cssString).trim();
    const styleObj = parseCSS(cssString);
    let inlineStyle = '';
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            inlineStyle += `${property}: ${styleObj[property]}; `;
        }
    }
    return inlineStyle.trim();
}
function vanillaElement(element) {
    if (/^[A-Z]/.test(element)) {
        element = 'emmy-' + element.toLowerCase();
    }
    return element;
}
class EmmyComponent extends HTMLElement {
    constructor() {
        super();
        this.contentGenerator = () => '';
        this.callback = (component) => { };
        this.Style = {};
    }
    addStyle(style) {
        for (const [element, elementStyle] of Object.entries(style)) {
            this.Style[element] = createInlineStyle(elementStyle);
            if (element == 'this') {
                this.setAttribute('style', this.Style[element]);
            }
        }
    }
    behave(element) {
        this.setAttribute('is', element);
    }
    render(generator, callback) {
        if (typeof generator !== 'function') {
            this.contentGenerator = () => generator;
        }
        else {
            this.contentGenerator = generator;
        }
        if (callback && typeof callback === 'function') {
            this.callback = callback;
        }
    }
}
export class Component extends EmmyComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = processGenerator(this.contentGenerator(this));
        this.callback.call(this, this);
    }
    querySelector(selector) {
        return this.shadowRoot.querySelector(vanillaElement(selector));
    }
}
export class LightComponent extends EmmyComponent {
    connectedCallback() {
        this.innerHTML = processGenerator(this.contentGenerator(this));
        this.callback.call(this, this);
    }
    querySelector(selector) {
        return HTMLElement.prototype.querySelector.call(this, vanillaElement(selector));
    }
}
export function useState(initialValue) {
    let value = initialValue;
    const state = () => value;
    const setState = (newValue) => {
        value = newValue;
    };
    return [state, setState];
}
function getValues(dependencies) {
    return dependencies.map((dependency) => dependency());
}
export function useEffect(callback, dependencies) {
    const oldCallback = this.effectCallback;
    if (!dependencies || dependencies.length === 0) {
        this.effectCallback = (component) => {
            oldCallback(component);
            callback.call(component, component);
        };
        return;
    }
    let oldDependencies = getValues(dependencies);
    this.effectCallback = (component) => {
        oldCallback(component);
        const newDependencies = getValues(dependencies);
        if (JSON.stringify(oldDependencies) !== JSON.stringify(newDependencies)) {
            oldDependencies = newDependencies;
            callback.call(component, component);
        }
    };
}
function bindHooks(component) {
    component.useState = useState.bind(component);
    component.useEffect = useEffect.bind(component);
}
export class FunctionalComponent extends LightComponent {
    constructor(func) {
        super();
        this.effectCallback = (component) => { };
        bindHooks.call(this, this);
        this.setState({ rerenderCount: 0 });
        const renderFunctionOrString = func.call(this, this);
        this.render(renderFunctionOrString);
    }
    connectedCallback() {
        super.connectedCallback();
        this.effectCallback(this);
    }
    static get observedAttributes() {
        return ['state'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'state') {
            this.connectedCallback();
        }
    }
    patchState(newState) {
        const currentState = this.state();
        const updatedState = Object.assign(currentState, newState);
        this.setState(updatedState);
    }
    rerender() {
        this.patchState({ rerenderCount: this.state().rerenderCount + 1 });
    }
    state() {
        return JSON.parse(this.getAttribute('state') || '');
    }
    setState(newState) {
        this.setAttribute('state', JSON.stringify(newState));
    }
    querySelector(selector) {
        let element = HTMLElement.prototype.querySelector.call(this, vanillaElement(selector));
        element.__proto__.addEventListener = (event, callback) => {
            const newCallback = (event) => {
                callback(event);
                this.rerender();
            };
            HTMLElement.prototype.addEventListener.call(element, event, newCallback);
        };
        return element;
    }
}
export class Route extends LightComponent {
    constructor() {
        super();
        this.render(``, () => {
            let to = this.getAttribute('to') || '';
            const componentName = "emmy-" + to.toLowerCase();
            const path = (this.getAttribute('href') === '/') ? '/root' : this.getAttribute('href') || '/404';
            Route.routes[path] = `<${componentName}></${componentName}>`;
        });
    }
}
Route.routes = {};
export class Router extends LightComponent {
    constructor() {
        super();
        this.behave('div');
        this.className = 'flex flex-col justify-center items-center space-y-3 text-center w-full h-full';
        this.handleLocation = () => {
            const path = window.location.pathname;
            const html = (path === '/' ? Route.routes['/root'] : Route.routes[path])
                || Route.routes['/404'] || '<h1>404</h1>';
            if (this.innerHTML !== html)
                this.innerHTML = html;
        };
        window.route = (event) => {
            event.preventDefault();
            const target = event.target;
            if (window.location.pathname === target.href)
                return;
            window.history.pushState({}, '', target.href);
            this.handleLocation();
        };
        window.onpopstate = this.handleLocation;
        this.render(``, () => this.handleLocation());
    }
}
export function launch(component, name) {
    if (customElements.get(vanillaElement(name))) {
        console.warn(`Custom element ${vanillaElement(name)} already defined`);
        return;
    }
    customElements.define(vanillaElement(name), component.constructor);
}
function createPageComponent(url, name) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
        load(() => html, name);
    });
}
export function load(func, name) {
    if (typeof func === 'string') {
        return createPageComponent(func, name);
    }
    if (typeof func === 'function') {
        class X extends FunctionalComponent {
            constructor() {
                super(func);
            }
        }
        launch(new X, name);
    }
    return launch(func, name);
}
load(new Route, 'Route');
load(new Router, 'Router');
