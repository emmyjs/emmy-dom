export { useEffect, useState } from './hooks.js';
export { Emmy, loadGlobalEmmy, RouteString, StyleObject, capitalizeFirstLetter, uncapitalizeFirstLetter, createInlineStyle, parseCSS, html, javascript, processGenerator, routerClassNames, vanillaElement } from './utils.js';
export declare const jsx: any;
import { EmmyComponent, FunctionalComponent, HTMLGenerator, ClassComponent } from './index.js';
export * from './index.js';
type HTMLGeneratorGenerator = ((component: EmmyComponent) => HTMLGenerator) | ((component?: EmmyComponent) => HTMLGenerator) | (() => HTMLGenerator);
export type BuildOptions = {
    dependencies: string;
    template: string;
    app: FunctionalComponent | ClassComponent;
    generators: {
        [key: string]: HTMLGeneratorGenerator;
    };
    path?: string;
};
export declare function renderToString(component: ClassComponent | FunctionalComponent): Promise<string>;
export declare function renderFunctionToString(generator: HTMLGeneratorGenerator): string;
export declare function hydrateScript(generator: HTMLGeneratorGenerator, name: string): string;
export declare function build({ dependencies, template, app, generators, path }: BuildOptions): Promise<void>;
