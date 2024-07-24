import { describe, it, expect } from 'vitest'
import { Component, LightComponent, load, HTMLGenerator, launch, createPageComponent, FunctionalComponent, RouteString, EmmyComponent } from '../src/index.ts'
import { attachToDocument, expectToBeSubclassOf } from './utils.ts'
import { HTMLElement } from 'happy-dom'

// @vitest-environment happy-dom

describe('load', () => {
  it('should load a shadow component', async () => {
    class A extends Component {
      constructor() {
        super()
        this.render = () => '<div></div>'
      }
    }
    load(A as unknown as Component, 'A')
    expect(attachToDocument()).to.be.instanceOf(HTMLElement)
  })
  it('should load a light component', async () => {
    class B extends LightComponent {
      constructor() {
        super()
        this.render = () => '<div></div>'
      }
    }
    load(B as unknown as LightComponent, 'B')
    expect(attachToDocument('emmy-b')).to.be.instanceOf(HTMLElement)
  })
  it('should load a functional component', async () => {
    const c = () => '<div></div>'
    load(c as HTMLGenerator, 'C')
    expect(attachToDocument()).to.be.instanceOf(HTMLElement)
  })
  it('should load a page component', async () => {
    load('https://github.com/' as RouteString, 'D')
    expect(attachToDocument('emmy-d')).to.be.instanceOf(HTMLElement)
  })
})

describe('launch', () => {
  it('should launch a shadow component', async () => {
    class E extends Component {
      constructor() {
        super()
        this.render = () => '<div></div>'
      }
    }
    launch(E as unknown as Component, 'E')
    expect(attachToDocument('emmy-e')).to.be.instanceOf(HTMLElement)
  })
  it('should launch a light component', async () => {
    class F extends LightComponent {
      constructor() {
        super()
        this.render = () => '<div></div>'
      }
    }
    launch(F as unknown as LightComponent, 'F')
    expect(attachToDocument('emmy-f')).to.be.instanceOf(HTMLElement)
  })
})

describe('createPageComponent', () => {
  it('should create a page component', async () => {
    const component = await createPageComponent('https://github.com/', 'G')
    expectToBeSubclassOf(component, FunctionalComponent)
  })
})
