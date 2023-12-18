export type DependencyArray = Array<(() => any) | any>;
export type RouteString = `/${string}`;
export type StyleObject = {
    [key: string]: string;
};
export declare const html: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export declare const javascript: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export declare function processGenerator(generator: string): string;
export declare function parseCSS(cssString: string): object;
export declare function createInlineStyle(cssString: string | object): string;
export declare function vanillaElement(element: string): string;
export declare function getValues(dependencies: DependencyArray): Array<any>;
export declare function useState(initialValue: any): [() => any, (newValue: any) => void];
export declare function capitalizeFirstLetter(str: string): string;
export declare function uncapitalizeFirstLetter(str: string): string;
export declare const routerClassNames = "flex flex-col justify-center items-center space-y-3 text-center w-full h-fit box-border";
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
    behave(element: string): void;
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
export declare function useEffect(callback: Callback, dependencies: DependencyArray): void;
export declare class FunctionalComponent extends LightComponent {
    effectCallback: (component: FunctionalComponent) => void;
    useState: (initialValue: any) => [() => any, (newValue: any) => void];
    useEffect: (callback: Callback, dependencies: DependencyArray) => void;
    constructor(func: HTMLGenerator);
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
export declare function build({ dependencies, template, app, generators, path }: BuildOptions): Promise<void>;
export {};
