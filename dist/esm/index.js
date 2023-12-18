var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import reactToCSS from 'react-style-object-to-css';
export const html = String.raw;
export const javascript = String.raw;
export function processGenerator(generator) {
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
export function parseCSS(cssString) {
    const styleObj = {};
    cssString.split(';').forEach((declaration) => {
        const [property, value] = declaration.split(':');
        if (property && value) {
            styleObj[property.trim()] = value.trim();
        }
    });
    return styleObj;
}
export function createInlineStyle(cssString) {
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
export function vanillaElement(element) {
    if (/^[A-Z]/.test(element)) {
        element = 'emmy-' + element.toLowerCase();
    }
    return element;
}
export function getValues(dependencies) {
    return dependencies.map((dependency) => {
        if (typeof dependency === 'function') {
            return dependency();
        }
        return dependency;
    });
}
export function useState(initialValue) {
    let value = initialValue;
    const state = () => value;
    const setState = (newValue) => {
        value = newValue;
    };
    return [state, setState];
}
export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function uncapitalizeFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
export const routerClassNames = 'flex flex-col justify-center items-center space-y-3 text-center w-full h-fit box-border';
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
export function useEffect(callback, dependencies) {
    const oldEffectCallback = this.effectCallback;
    if (!dependencies || dependencies.length === 0) {
        this.effectCallback = (component) => {
            oldEffectCallback(component);
            callback.call(component, component);
        };
        return;
    }
    let oldDependencies = getValues(dependencies);
    this.effectCallback = (component) => {
        oldEffectCallback(component);
        const newDependencies = getValues(dependencies);
        if (JSON.stringify(oldDependencies) !== JSON.stringify(newDependencies)) {
            oldDependencies = newDependencies;
            callback.call(component, component);
        }
    };
    dependencies.find((dependency) => {
        if (typeof dependency === 'string') {
            if (dependency === 'didMount') {
                const oldCallback = this.callback;
                this.callback = (component) => {
                    oldCallback.call(component, component);
                    callback.call(component, component);
                };
            }
        }
        return false;
    });
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
        return JSON.parse(this.getAttribute('state').replace(/'/g, '"') || '');
    }
    setState(newState) {
        this.setAttribute('state', JSON.stringify(newState).replace(/"/g, "'"));
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
        this.className = routerClassNames;
        this.handleLocation = () => {
            const path = window.location.pathname;
            const htmlText = (path === '/' ? Route.routes['/root'] : Route.routes[path])
                || Route.routes['/404'] || html `<h1>404</h1>`;
            if (this.innerHTML !== htmlText)
                this.innerHTML = htmlText;
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
        return component;
    }
    customElements.define(vanillaElement(name), component);
    return component;
}
function createPageComponent(url, name) {
    let component;
    () => __awaiter(this, void 0, void 0, function* () {
        const result = yield fetch(url);
        const htmlText = yield result.text();
        component = load(() => htmlText, name);
    });
    return component;
}
export function load(func, name) {
    if (typeof func === 'string') {
        return createPageComponent(func, name);
    }
    try {
        const instance = new func();
        if (instance instanceof Component || instance instanceof LightComponent || instance instanceof FunctionalComponent) {
            return launch(func, name);
        }
        throw new Error('Not a valid component');
    }
    catch (e) {
        class X extends FunctionalComponent {
            constructor() {
                super(func);
            }
        }
        return launch(X, name);
    }
}
launch(Route, 'Route');
launch(Router, 'Router');
