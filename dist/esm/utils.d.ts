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
