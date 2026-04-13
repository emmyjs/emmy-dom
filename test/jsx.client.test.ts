import { describe, it, expect } from 'vitest'
import { Component, FunctionalComponent, load, jsx } from '../src/index.ts'

// @vitest-environment happy-dom

describe('JSX in client components', () => {
  it('renders JSX output in shadow class components', () => {
    class JSXShadowComponent extends Component {
      constructor() {
        super()
        this.render(jsx('section', { id: 'shadow-jsx', class: 'hero' }))
      }
    }

    customElements.define('emmy-jsxshadowcomponent', JSXShadowComponent)
    document.body.innerHTML = '<emmy-jsxshadowcomponent></emmy-jsxshadowcomponent>'

    const root = document.querySelector('emmy-jsxshadowcomponent')?.shadowRoot
    const section = root?.querySelector('#shadow-jsx') as HTMLElement
    expect(section).toBeDefined()
    expect(section.tagName.toLowerCase()).toBe('section')
    expect(section.getAttribute('class')).toBe('hero')
  })

  it('renders JSX output in loaded functional components', async () => {
    const JSXFunctional = () => jsx('article', { id: 'functional-jsx', class: 'card' })

    await load(JSXFunctional, 'JSXFunctionalA')
    document.body.innerHTML = '<emmy-jsxfunctionala></emmy-jsxfunctionala>'

    const article = document.querySelector('emmy-jsxfunctionala')?.querySelector('#functional-jsx') as HTMLElement
    expect(article).toBeDefined()
    expect(article.tagName.toLowerCase()).toBe('article')
    expect(article.getAttribute('class')).toBe('card')
  })

})
