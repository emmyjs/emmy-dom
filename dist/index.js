var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export * from './commonExports.js';
import { render as renderJSX } from 'jsx-to-html';
import { useEffect, useState } from './hooks.js';
import { createInlineStyle, html, processGenerator, routerClassNames, vanillaElement } from './utils.js';
export const jsx = renderJSX;
export class EmmyComponent extends HTMLElement {
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
    render(generator, callback) {
        if (typeof generator !== 'function' && typeof generator !== 'string') {
            try {
                const htmlFromJSX = jsx(generator);
                console.log(htmlFromJSX);
                this.contentGenerator = () => htmlFromJSX;
            }
            catch (e) {
                this.contentGenerator = () => generator;
            }
        }
        else if (typeof generator !== 'function') {
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
export function bindHooks(component) {
    component.useState = useState.bind(component);
    component.useEffect = useEffect.bind(component);
}
export class FunctionalComponent extends LightComponent {
    constructor(func) {
        super();
        this.effectCallback = (component) => { };
        bindHooks.call(this, this);
        this.setState({ rerenderCount: 0 });
        const renderFunctionOrString = func.call(this, {
            el: this,
            props: () => this.props,
            children: () => this.innerHTML
        });
        this.render(renderFunctionOrString);
    }
    get props() {
        return Array.from(this.attributes).reduce((acc, attr) => {
            const name = attr.name === 'class' ? 'className' : attr.name;
            return Object.assign(Object.assign({}, acc), { [name]: () => this.getAttribute(attr.name) });
        }, {});
    }
    set props(props) {
        for (const [key, value] of Object.entries(props)) {
            if (key === 'className') {
                this.className = value;
                continue;
            }
            this.setAttribute(key, value);
        }
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
        this.setAttribute('state', JSON.stringify(newState).replace(/"/g, '\''));
    }
    querySelector(selector) {
        const element = HTMLElement.prototype.querySelector.call(this, vanillaElement(selector));
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
        this.render('', () => {
            const to = this.getAttribute('to') || '';
            const componentName = 'emmy-' + to.toLowerCase();
            const path = (this.getAttribute('href') === '/') ? '/root' : this.getAttribute('href') || '/404';
            Route.routes[path] = `<${componentName}></${componentName}>`;
        });
    }
}
Route.routes = {};
export class Router extends LightComponent {
    constructor() {
        super();
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
        this.render('', () => this.handleLocation());
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
export function createPageComponent(url, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetch(url);
        const htmlText = yield result.text();
        return load(() => htmlText, name);
    });
}
export function load(func, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof func === 'string') {
            return yield createPageComponent(func, name);
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
    });
}
launch(Route, 'Route');
launch(Router, 'Router');
