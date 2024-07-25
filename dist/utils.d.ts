export declare function processGenerator(generator: string): string;
export declare function parseCSS(cssString: string): object;
export declare function createInlineStyle(cssString: string | object): string;
export declare function vanillaElement(element: string): string;
export declare function capitalizeFirstLetter(str: string): string;
export declare function uncapitalizeFirstLetter(str: string): string;
export declare const Emmy: {};
export declare const loadGlobalEmmy: (obj: object) => void;
export declare const html: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export declare const javascript: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export declare const routerClassNames = "flex flex-col justify-center items-center space-y-3 text-center w-full h-fit box-border";
export type RouteString = `/${string}`;
export type StyleObject = string | {
    [key: string]: StyleObject;
};
export declare function isServer(): boolean;
