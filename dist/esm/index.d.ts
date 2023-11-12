type HTMLGenerator = ((component: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string);
type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void);
type StyleObject = {
    [key: string]: string;
};
type DependencyArray = Array<(() => any) | any>;
declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
type ClassComponent = Component | LightComponent;
type RouteString = `/${string}`;
type ComponentType = ClassComponent | FunctionalComponent | HTMLGenerator | RouteString;
declare abstract class EmmyComponent extends HTMLElement {
    contentGenerator: HTMLGenerator;
    callback: Callback;
    Style: StyleObject;
    constructor();
    addStyle(style: StyleObject): void;
    behave(element: string): void;
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
export declare function useState(initialValue: any): [() => any, (newValue: any) => void];
export declare function useEffect(callback: Callback, dependencies: DependencyArray): void;
export declare class FunctionalComponent extends LightComponent {
    effectCallback: (component: FunctionalComponent) => void;
    useState: (initialValue: any) => [() => any, (newValue: any) => void];
    useEffect: (callback: Callback, dependencies: DependencyArray) => void;
    constructor(func: any);
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
export declare function launch(component: ClassComponent | FunctionalComponent, name: string): void;
export declare function load(func: ComponentType, name: string): void;
export {};
