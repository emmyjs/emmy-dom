var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jsxToHtml from 'jsx-to-html';
const { render: renderJSX } = jsxToHtml;
import { Emmy, capitalizeFirstLetter, html, javascript, uncapitalizeFirstLetter, vanillaElement } from './utils.js';
export { useEffect, useState } from './hooks.js';
export { Emmy, loadGlobalEmmy, capitalizeFirstLetter, uncapitalizeFirstLetter, createInlineStyle, parseCSS, html, javascript, processGenerator, routerClassNames, vanillaElement } from './utils.js';
export const jsx = renderJSX;
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const render = require('./ssr');
require('./ssr/register');
export * from '../src/index.js';
export function renderToString(component) {
    return __awaiter(this, void 0, void 0, function* () {
        const instance = new component();
        const htmlText = yield render(instance);
        return htmlText;
    });
}
export function renderFunctionToString(generator) {
    const stringFromGenerator = String(generator);
    /*
    type HTMLGeneratorWithOptionalComponent = ((component?: EmmyComponent) => string) | (() => string)
    const el = new FunctionalComponent(generator)
    let result = (generator.bind(el) as any)({ el: el })
    if (typeof result === 'function') {
      result = (result as HTMLGeneratorWithOptionalComponent)()
    }
    console.log(result)
    */
    return stringFromGenerator;
}
export function hydrateScript(generator, name) {
    return javascript `
    ${renderFunctionToString(generator)}
    load(${uncapitalizeFirstLetter(name)}, '${capitalizeFirstLetter(name)}')
    document.querySelectorAll('${vanillaElement(capitalizeFirstLetter(name))}').forEach((element) => {
      element.connectedCallback()
    })
  `;
}
export function build({ dependencies, template, app, generators, path }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!path)
            path = 'index.html';
        console.log(`> Building app in ${path}`);
        const templateString = readFileSync(template, 'utf-8');
        const ssr = yield renderToString(app);
        let javascriptString = '';
        for (const name in generators) {
            if (['Route', 'Router'].includes(name))
                continue;
            javascriptString += hydrateScript(generators[name], name);
        }
        const content = html `
    ${ssr}
    <script type="module">
      import { loadGlobalEmmy } from 'emmy-dom'
      loadGlobalEmmy(${JSON.stringify(Emmy)})
      ${dependencies}
      ${javascriptString}
    </script>
  `;
        const htmlString = templateString.replace('{content}', content);
        writeFileSync(path, htmlString);
    });
}
