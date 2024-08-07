export * from './commonExports.js'

import { Hoakable, UseEffect, UseState, bindHooks } from './hooks.js'
import {
  Render,
  StyleObject,
  createInlineStyle,
  html,
  jsx,
  processGenerator,
  routerClassNames,
  vanillaElement
} from './utils.js'

export type MetaProps = {
  el: FunctionalComponent,
  props: () => object,
  children: () => string
}

export type HTMLGenerator = ((props: EmmyComponent) => string) | ((component?: EmmyComponent) => string) | (() => string)
export type FunctionalComponentGenerator = ((props: MetaProps) => Render) | ((props?: MetaProps) => Render) | (() => Render)

export type Callback = ((component: EmmyComponent) => void) | ((component?: EmmyComponent) => void) | (() => void)
declare global {
  interface Window {
    route: (event: Event) => void
  }
}
export type ClassComponent = Component | LightComponent
export type ComponentType = ClassComponent | FunctionalComponent | FunctionalComponentGenerator | string

export abstract class EmmyComponent extends HTMLElement {
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

  abstract querySelector(selector: string): HTMLElement | null
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

  querySelector(selector: string): HTMLElement | null {
    return this.shadowRoot!.querySelector(vanillaElement(selector))
  }
}

export class LightComponent extends EmmyComponent {
  connectedCallback() {
    this.innerHTML = processGenerator(this.contentGenerator(this))
    this.callback.call(this, this)
  }

  querySelector(selector: string): HTMLElement | null {
    return HTMLElement.prototype.querySelector.call(this, vanillaElement(selector))
  }
}

export class FunctionalComponent extends LightComponent implements Hoakable {
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

  querySelector(selector: string): HTMLElement | null {
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
  static routes: { [key: string]: string } = {}

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

export function launch(component: ClassComponent | FunctionalComponent, name: string) {
  if (customElements.get(vanillaElement(name))) {
    console.warn(`Custom element ${vanillaElement(name)} already defined`)
    return component
  }
  customElements.define(vanillaElement(name), component as unknown as CustomElementConstructor)
  return component
}

export async function createPageComponent(url: string, name: string): Promise<ClassComponent | FunctionalComponent> {
  const result = await fetch(url)
  const htmlText = await result.text()
  return load(() => htmlText, name)
}

export async function load(func: ComponentType, name: string): Promise<ClassComponent | FunctionalComponent> {
  if (typeof func === 'string') {
    return await createPageComponent(func, name)
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

launch(Route as unknown as ClassComponent, 'Route')
launch(Router as unknown as ClassComponent, 'Router')
