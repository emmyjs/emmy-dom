import reactToCSS from 'react-style-object-to-css';

export type HTMLGenerator = ((component: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string);
export type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void);
type StyleObject = {
    [key: string]: string
}
type DependencyArray = Array<(() => any) | any>;
declare global {
    interface Window {
      route: (event: Event) => void;
    }
}
export type ClassComponent = Component | LightComponent;
type RouteString = `/${string}`;
type ComponentType = ClassComponent | FunctionalComponent | HTMLGenerator | RouteString;


function processGenerator (generator: string): string {
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

function parseCSS (cssString: string): object {
    const styleObj = {};
    cssString.split(';').forEach((declaration) => {
        const [property, value] = declaration.split(':');
        if (property && value) {
            styleObj[property.trim()] = value.trim();
        }
    });
    return styleObj;
}

function createInlineStyle (cssString: string | object): string {
    if (typeof cssString !== 'string') return reactToCSS(cssString).trim();
    const styleObj = parseCSS(cssString);
    let inlineStyle = '';
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            inlineStyle += `${property}: ${styleObj[property]}; `;
        }
    }
    return inlineStyle.trim();
}

function vanillaElement (element: string): string {
    if (/^[A-Z]/.test(element)) {
        element = 'emmy-' + element.toLowerCase();
    }
    return element;
}


abstract class EmmyComponent extends HTMLElement {
    contentGenerator: HTMLGenerator;
    callback: Callback;
    Style: StyleObject;

    constructor() {
        super();
        this.contentGenerator = () => '';
        this.callback = (component: EmmyComponent) => {};
        this.Style = {};
    }

    addStyle(style: StyleObject) {
        for (const [element, elementStyle] of Object.entries(style)) {
            this.Style[element] = createInlineStyle(elementStyle);
            if (element == 'this') {
                this.setAttribute('style', this.Style[element]);
            }
        }
    }

    behave(element: string) {
        this.setAttribute('is', element);
    }

    abstract connectedCallback(): void;

    render(generator: string | HTMLGenerator, callback?: Callback) {
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

    abstract querySelector(selector: string): HTMLElement | null;
}


export class Component extends EmmyComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = processGenerator(this.contentGenerator(this));
        this.callback.call(this, this);
    }

    querySelector(selector: string): HTMLElement | null {
        return this.shadowRoot!.querySelector(vanillaElement(selector));
    }
}


export class LightComponent extends EmmyComponent {
    connectedCallback() {
        this.innerHTML = processGenerator(this.contentGenerator(this));
        this.callback.call(this, this);
    }

    querySelector(selector: string): HTMLElement | null {
        return HTMLElement.prototype.querySelector.call(this, vanillaElement(selector));
    }
}

export function useState (initialValue): [() => any, (newValue: any) => void] {
    let value = initialValue;
    const state = () => value;
    const setState = (newValue) => {
        value = newValue;
    }
    return [state, setState];
}

function getValues (dependencies: DependencyArray): Array<any> {
    return dependencies.map((dependency) => {
        if (typeof dependency === 'function') {
            return dependency();
        }
        return dependency;
    });
}

export function useEffect (callback: Callback, dependencies: DependencyArray) {
    const oldEffectCallback = this.effectCallback;
    if (!dependencies || dependencies.length === 0) {
        this.effectCallback = (component) => {
            oldEffectCallback(component);
            callback.call(component, component);
        }
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
    }
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

function bindHooks (component: FunctionalComponent) {
    component.useState = useState.bind(component);
    component.useEffect = useEffect.bind(component);
}


export class FunctionalComponent extends LightComponent {
    effectCallback: (component: FunctionalComponent) => void;
    useState: (initialValue: any) => [() => any, (newValue: any) => void];
    useEffect: (callback: Callback, dependencies: DependencyArray) => void;

    constructor(func: HTMLGenerator) {
        super();
        this.effectCallback = (component: FunctionalComponent) => {};
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

    patchState(newState: object) {
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

    setState(newState: object) {
        this.setAttribute('state', JSON.stringify(newState).replace(/"/g, "'"));
    }

    querySelector(selector: string): HTMLElement | null {
        let element = HTMLElement.prototype.querySelector.call(this, vanillaElement(selector));
        element.__proto__.addEventListener = (event, callback) => {
            const newCallback = (event) => {
                callback(event);
                this.rerender();
            }
            HTMLElement.prototype.addEventListener.call(element, event, newCallback);
        }
        return element;
    }
}


export class Route extends LightComponent {
    static routes: { [key: RouteString]: string } = {};

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


export class Router extends LightComponent {
    handleLocation: () => void;

    constructor() {
        super();
        this.behave('div');
        this.className = 'flex flex-col justify-center items-center space-y-3 text-center w-full h-full box-border';

        this.handleLocation = () => {
            const path = window.location.pathname;
            const html = (path === '/' ? Route.routes['/root'] : Route.routes[path])
                || Route.routes['/404'] || '<h1>404</h1>';
            if (this.innerHTML !== html) this.innerHTML = html;
        }

        window.route = (event) => {
            event.preventDefault();
            const target = event.target as HTMLAnchorElement;
            if (window.location.pathname === target.href!) return;
            window.history.pushState({}, '', target.href!);
            this.handleLocation();
        }

        window.onpopstate = this.handleLocation;

        this.render(``, () => this.handleLocation());
    }
}

export function launch (component: ClassComponent | FunctionalComponent, name: string) {
    if (customElements.get(vanillaElement(name))) {
        console.warn(`Custom element ${vanillaElement(name)} already defined`);
        return component;
    }
    customElements.define(vanillaElement(name), component as unknown as CustomElementConstructor);
    return component;
}

function createPageComponent (url: string, name: string): ClassComponent | FunctionalComponent {
    let component;
    async () => {
        const result = await fetch(url);
        const html = await result.text();
        component = load(() => html, name);
    }
    return component;
}

export function load (func: ComponentType, name: string): ClassComponent | FunctionalComponent {
    if (typeof func === 'string') {
        return createPageComponent(func, name);
    }

    if (typeof func === 'function') {
        class X extends FunctionalComponent {
            constructor() {
                super(func as HTMLGenerator);
            }
        }
        return launch(X as unknown as FunctionalComponent, name);
    }

    return launch(func as ClassComponent, name);
}

load(Route as unknown as ComponentType, 'Route');
load(Router as unknown as ComponentType, 'Router');
