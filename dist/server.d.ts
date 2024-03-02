import { UseEffect, UseState } from './hooks';
import { RouteString, StyleObject } from './utils';
export { useEffect, useState } from './hooks';
export { Emmy, loadGlobalEmmy, RouteString, StyleObject, capitalizeFirstLetter, uncapitalizeFirstLetter, createInlineStyle, parseCSS, html, javascript, processGenerator, routerClassNames, vanillaElement } from './utils';
export declare const jsx: any;
export type HTMLGenerator = ((component: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string);
export type HTMLGeneratorGenerator = ((component: EmmyComponent) => HTMLGenerator) | ((component?: EmmyComponent) => HTMLGenerator) | (() => HTMLGenerator) | HTMLGenerator;
export type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void);
declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
export type ClassComponent = Component | LightComponent;
export type ComponentType = ClassComponent | FunctionalComponent | HTMLGeneratorGenerator | RouteString;
export type BuildOptions = {
    dependencies: string;
    template: string;
    app: FunctionalComponent | ClassComponent;
    generators: {
        [key: string]: HTMLGeneratorGenerator;
    };
    path?: string;
};
declare abstract class EmmyComponent extends HTMLElement {
    contentGenerator: HTMLGenerator;
    callback: Callback;
    Style: StyleObject;
    constructor();
    addStyle(style: StyleObject): void;
    abstract connectedCallback(): void;
    render(generator: string | HTMLGenerator, callback?: Callback): void;
    abstract __querySelector(selector: string): HTMLElement | null;
    querySelector(selector: string): HTMLElement | null;
}
export declare class Component extends EmmyComponent {
    constructor();
    connectedCallback(): void;
    __querySelector(selector: string): HTMLElement | null;
}
export declare class LightComponent extends EmmyComponent {
    connectedCallback(): void;
    __querySelector(selector: string): HTMLElement | null;
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
    __querySelector(selector: string): HTMLElement | null;
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
export declare function renderToString(component: ClassComponent | FunctionalComponent): Promise<string>;
export declare function renderFunctionToString(generator: HTMLGeneratorGenerator): string;
export declare function hydrateScript(generator: HTMLGeneratorGenerator, name: string): string;
export declare function build({ dependencies, template, app, generators, path }: BuildOptions): Promise<void>;
