export * from './commonExports.js';
import { Hoakable, UseEffect, UseState } from './hooks.js';
import { Render, StyleObject } from './utils.js';
export type MetaProps = {
    el: FunctionalComponent;
    props: () => object;
    children: () => string;
};
export type HTMLGenerator = ((props: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string);
export type FunctionalComponentGenerator = ((props: MetaProps) => Render) | ((props?: MetaProps) => Render) | (() => Render);
export type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void);
declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
export type ClassComponent = Component | LightComponent;
export type ComponentType = ClassComponent | FunctionalComponent | FunctionalComponentGenerator | string;
export declare abstract class EmmyComponent extends HTMLElement {
    contentGenerator: HTMLGenerator;
    callback: Callback;
    Style: StyleObject;
    constructor();
    addStyle(style: StyleObject): void;
    abstract connectedCallback(): void;
    render(generator: string | HTMLGenerator, callback?: Callback): void;
    abstract querySelector(selector: string): HTMLElement | null;
}
export declare class Component extends EmmyComponent {
    constructor();
    connectedCallback(): void;
    querySelector(selector: string): HTMLElement | null;
}
export declare class LightComponent extends EmmyComponent {
    connectedCallback(): void;
    querySelector(selector: string): HTMLElement | null;
}
export declare class FunctionalComponent extends LightComponent implements Hoakable {
    effectCallback: (component: FunctionalComponent) => void;
    useState: UseState;
    useEffect: UseEffect;
    constructor(func: HTMLGenerator);
    get props(): object;
    set props(props: object);
    connectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    patchState(newState: object): void;
    rerender(): void;
    state(): any;
    setState(newState: object): void;
    querySelector(selector: string): HTMLElement | null;
}
export declare class Route extends LightComponent {
    static routes: {
        [key: string]: string;
    };
    constructor();
}
export declare class Router extends LightComponent {
    handleLocation: () => void;
    constructor();
}
export declare function launch(component: ClassComponent | FunctionalComponent, name: string): FunctionalComponent | ClassComponent;
export declare function createPageComponent(url: string, name: string): Promise<ClassComponent | FunctionalComponent>;
export declare function load(func: ComponentType, name: string): Promise<ClassComponent | FunctionalComponent>;
