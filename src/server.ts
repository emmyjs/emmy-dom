import jsxToHtml from 'jsx-to-html'
const { render: renderJSX } = jsxToHtml
import {
  Emmy,
  capitalizeFirstLetter,
  html,
  javascript,
  uncapitalizeFirstLetter,
  vanillaElement
} from './utils.js'

export { useEffect, useState } from './hooks.js'
export {
  Emmy, loadGlobalEmmy,
  RouteString, StyleObject,
  capitalizeFirstLetter, uncapitalizeFirstLetter,
  createInlineStyle, parseCSS,
  html, javascript,
  processGenerator, routerClassNames, vanillaElement
} from './utils.js'

export const jsx = renderJSX

import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const render = require('./ssr')
require('./ssr/register')

import { EmmyComponent, FunctionalComponent, HTMLGenerator, ClassComponent } from '../src/index.js'
export * from '../src/index.js'

type HTMLGeneratorGenerator = ((component: EmmyComponent) => HTMLGenerator) | ((component?: EmmyComponent) => HTMLGenerator) | (() => HTMLGenerator)

export type BuildOptions = {
  dependencies: string,
  template: string,
  app: FunctionalComponent | ClassComponent,
  generators: { [key: string]: HTMLGeneratorGenerator },
  path?: string
}


export async function renderToString(component: ClassComponent | FunctionalComponent): Promise<string> {
  const instance = new (component as any)()
  const htmlText = await (render as any)(instance)
  return htmlText
}

export function renderFunctionToString(generator: HTMLGeneratorGenerator) {
  const stringFromGenerator = String(generator)
  /*
  type HTMLGeneratorWithOptionalComponent = ((component?: EmmyComponent) => string) | (() => string)
  const el = new FunctionalComponent(generator)
  let result = (generator.bind(el) as any)({ el: el })
  if (typeof result === 'function') {
    result = (result as HTMLGeneratorWithOptionalComponent)()
  }
  console.log(result)
  */
  return stringFromGenerator
}

export function hydrateScript(generator: HTMLGeneratorGenerator, name: string) {
  return javascript`
    ${renderFunctionToString(generator)}
    load(${uncapitalizeFirstLetter(name)}, '${capitalizeFirstLetter(name)}')
    document.querySelectorAll('${vanillaElement(capitalizeFirstLetter(name))}').forEach((element) => {
      element.connectedCallback()
    })
  `
}

export async function build ({ dependencies, template, app, generators, path }: BuildOptions) {
  if (!path) path = 'index.html'
  console.log(`> Building app in ${path}`)
  const templateString = readFileSync(template, 'utf-8')
  const ssr = await renderToString(app)
  let javascriptString = ''
  for (const name in generators) {
    if ([ 'Route', 'Router' ].includes(name)) continue
    javascriptString += hydrateScript(generators[name], name)
  }
  const content = html`
    ${ssr}
    <script type="module">
      import { loadGlobalEmmy } from 'emmy-dom'
      loadGlobalEmmy(${JSON.stringify(Emmy)})
      ${dependencies}
      ${javascriptString}
    </script>
  `
  const htmlString = templateString.replace('{content}', content)
  writeFileSync(path, htmlString)
}
