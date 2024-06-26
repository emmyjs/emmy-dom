import { UseEffect, UseState } from './hooks.js';
import { RouteString, StyleObject } from './utils.js';
export { useEffect, useState } from './hooks.js';
export { Emmy, loadGlobalEmmy, RouteString, StyleObject, capitalizeFirstLetter, uncapitalizeFirstLetter, createInlineStyle, parseCSS, html, javascript, processGenerator, routerClassNames, vanillaElement } from './utils.js';
export declare const jsx: any;
export type HTMLGenerator = ((component: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string);
export type HTMLGeneratorGenerator = ((component: EmmyComponent) => HTMLGenerator) | ((component?: EmmyComponent) => HTMLGenerator) | (() => HTMLGenerator);
export type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void);
declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
export type ClassComponent = Component | LightComponent;
export type ComponentType = ClassComponent | FunctionalComponent | HTMLGenerator | RouteString;
declare abstract class EmmyComponent extends HTMLElement {
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
export declare class FunctionalComponent extends LightComponent {
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
        [key: RouteString]: string;
    };
    constructor();
}
export declare class Router extends LightComponent {
    handleLocation: () => void;
    constructor();
}
export declare function launch(component: ClassComponent | FunctionalComponent, name: string): ClassComponent | FunctionalComponent;
export declare function load(func: ComponentType, name: string): ClassComponent | FunctionalComponent;
