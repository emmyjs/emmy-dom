import { render as renderJSX } from 'jsx-to-html'
import { UseEffect, UseState, useEffect, useState } from './hooks'
import {
  Emmy,
  RouteString,
  StyleObject,
  capitalizeFirstLetter,
  createInlineStyle,
  html,
  javascript,
  processGenerator,
  routerClassNames,
  uncapitalizeFirstLetter,
  vanillaElement
} from './utils'

export { useEffect, useState } from './hooks'
export {
  Emmy, loadGlobalEmmy,
  RouteString, StyleObject,
  capitalizeFirstLetter, uncapitalizeFirstLetter,
  createInlineStyle, parseCSS,
  html, javascript,
  processGenerator, routerClassNames,  vanillaElement
} from './utils'

export const jsx = renderJSX

import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const render = require('./ssr')
require('./ssr/register')

export type HTMLGenerator = ((component: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string)
export type HTMLGeneratorGenerator = ((component: EmmyComponent) => HTMLGenerator) | ((component?: EmmyComponent) => HTMLGenerator) | (() => HTMLGenerator) | HTMLGenerator
export type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void)
declare global {
  interface Window {
    route: (event: Event) => void
  }
}
export type ClassComponent = Component | LightComponent
export type ComponentType = ClassComponent | FunctionalComponent | HTMLGeneratorGenerator | RouteString
export type BuildOptions = {
  dependencies: string,
  template: string,
  app: FunctionalComponent | ClassComponent,
  generators: { [key: string]: HTMLGeneratorGenerator },
  path?: string
}

abstract class EmmyComponent extends HTMLElement {
  contentGenerator: HTMLGenerator
  callback: Callback
  Style: StyleObject

  constructor() {
    super()
    this.contentGenerator = () => ''
    this.callback = (component: EmmyComponent) => {}
    this.Style = {}
  }

  addStyle(style: StyleObject) {
    for (const [element, elementStyle] of Object.entries(style)) {
      this.Style[element] = createInlineStyle(elementStyle)
      if (element == 'this') {
        this.setAttribute('style', this.Style[element])
      }
    }
  }

  abstract connectedCallback(): void

  render(generator: string | HTMLGenerator, callback?: Callback) {
    if (typeof generator !== 'function' && typeof generator !== 'string') {
      try {
        const htmlFromJSX = jsx(generator)
        console.log(htmlFromJSX)
        this.contentGenerator = () => htmlFromJSX
      }
      catch (e) {
        this.contentGenerator = () => generator
      }
    }
    else if (typeof generator !== 'function') {
      this.contentGenerator = () => generator
    }
    else {
      this.contentGenerator = generator
    }
    if (callback && typeof callback === 'function') {
      this.callback = callback
    }
  }

  abstract __querySelector(selector: string): HTMLElement | null

  querySelector(selector: string): HTMLElement | null {
    this.setAttribute('emmy-hydratation', 'true')
    return this
  }
}


export class Component extends EmmyComponent {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = processGenerator(this.contentGenerator(this))
    this.callback.call(this, this)
  }

  __querySelector(selector: string): HTMLElement | null {
    return this.shadowRoot!.querySelector(vanillaElement(selector))
  }
}


export class LightComponent extends EmmyComponent {
  connectedCallback() {
    this.innerHTML = processGenerator(this.contentGenerator(this))
    this.callback.call(this, this)
  }

  __querySelector(selector: string): HTMLElement | null {
    return HTMLElement.prototype.querySelector.call(this, vanillaElement(selector))
  }
}

function bindHooks (component: FunctionalComponent) {
  component.useState = useState.bind(component)
  component.useEffect = useEffect.bind(component)
}


export class FunctionalComponent extends LightComponent {
  effectCallback: (component: FunctionalComponent) => void
  useState: UseState
  useEffect: UseEffect

  constructor(func: HTMLGenerator) {
    super()
    this.effectCallback = (component: FunctionalComponent) => {}
    bindHooks.call(this, this)
    this.setState({ rerenderCount: 0 })
    const renderFunctionOrString = func.call(this, {
      el: this,
      props: () => this.props,
      children: () => this.innerHTML
    })
    this.render(renderFunctionOrString)
  }

  get props() {
    return Array.from(this.attributes).reduce((acc, attr) => {
      const name = attr.name as any === 'class' ? 'className' : attr.name
      return { ...acc, [name]: () => this.getAttribute(attr.name) }
    }, {})
  }

  set props(props: object) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'className') {
        this.className = value
        continue
      }
      this.setAttribute(key, value)
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.effectCallback(this)
  }

  static get observedAttributes() {
    return ['state']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'state') {
      this.connectedCallback()
    }
  }

  patchState(newState: object) {
    const currentState = this.state()
    const updatedState = Object.assign(currentState, newState)
    this.setState(updatedState)
  }

  rerender() {
    this.patchState({ rerenderCount: this.state().rerenderCount + 1 })
  }

  state() {
    return JSON.parse(this.getAttribute('state')!.replace(/'/g, '"') || '')
  }

  setState(newState: object) {
    this.setAttribute('state', JSON.stringify(newState).replace(/"/g, '\''))
  }

  __querySelector(selector: string): HTMLElement | null {
    const element = HTMLElement.prototype.querySelector.call(this, vanillaElement(selector))
    element.__proto__.addEventListener = (event, callback) => {
      const newCallback = (event) => {
        callback(event)
        this.rerender()
      }
      HTMLElement.prototype.addEventListener.call(element, event, newCallback)
    }
    return element
  }
}


export class Route extends LightComponent {
  static routes: { [key: RouteString]: string } = {}

  constructor() {
    super()

    this.render('', () => {
      const to = this.getAttribute('to') || ''
      const componentName = 'emmy-' + to.toLowerCase()
      const path = (this.getAttribute('href') === '/') ? '/root' : this.getAttribute('href') || '/404'
      Route.routes[path] = `<${componentName}></${componentName}>`
    })
  }
}


export class Router extends LightComponent {
  handleLocation: () => void

  constructor() {
    super()
    this.className = routerClassNames

    this.handleLocation = () => {
      const path = window.location.pathname
      const htmlText = (path === '/' ? Route.routes['/root'] : Route.routes[path])
          || Route.routes['/404'] || html`<h1>404</h1>`
      if (this.innerHTML !== htmlText) this.innerHTML = htmlText
    }

    window.route = (event) => {
      event.preventDefault()
      const target = event.target as HTMLAnchorElement
      if (window.location.pathname === target.href!) return
      window.history.pushState({}, '', target.href!)
      this.handleLocation()
    }

    window.onpopstate = this.handleLocation

    this.render('', () => this.handleLocation())
  }
}

export function launch (component: ClassComponent | FunctionalComponent, name: string): ClassComponent | FunctionalComponent {
  if (window.customElements.get(vanillaElement(name))) {
    console.warn(`Custom element ${vanillaElement(name)} already defined`)
    return component
  }
  window.customElements.define(vanillaElement(name), component as unknown as CustomElementConstructor)
  return component
}

function createPageComponent (url: string, name: string): ClassComponent | FunctionalComponent {
  let component
  async () => {
    const result = await fetch(url)
    const htmlText= await result.text()
    component = load(() => htmlText, name)
  }
  return component
}

export function load (func: ComponentType, name: string): ClassComponent | FunctionalComponent {
  if (typeof func === 'string') {
    return createPageComponent(func, name)
  }
  try {
    const instance = new (func as any)() as any
    if (instance instanceof Component || instance instanceof LightComponent || instance instanceof FunctionalComponent) {
      return launch(func as ClassComponent, name)
    }
    throw new Error('Not a valid component')
  }
  catch (e) {
    class X extends FunctionalComponent {
      constructor() {
        super(func as HTMLGenerator)
      }
    }
    return launch(X as unknown as FunctionalComponent, name)
  }
}

load(Route as unknown as ClassComponent, 'Route')
load(Router as unknown as ClassComponent, 'Router')

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
