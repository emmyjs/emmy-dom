import { describe, it, expect } from 'vitest'
import { Component, LightComponent, FunctionalComponent, load } from '../src/index.ts'
import { HTMLElement } from 'happy-dom'

function awaitDidMount(componentName) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (document.querySelector(componentName).didMount) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

// @vitest-environment happy-dom

describe('Component', () => {
  it('should be defined', () => {
    expect(Component).toBeDefined()
  })
  it('should have a render method', () => {
    expect(new Component().render).toBeDefined()
  })
  it('should have a connectedCallback method', () => {
    expect(new Component().connectedCallback).toBeDefined()
  })
  it('should have a querySelector method', () => {
    expect(new Component().querySelector).toBeDefined()
  })
  it('should have a addStyle method', () => {
    expect(new Component().addStyle).toBeDefined()
  })
  it('should have a Style property', () => {
    expect(new Component().Style).toBeDefined()
  })
  it('should have a contentGenerator property', () => {
    expect(new Component().contentGenerator).toBeDefined()
  })
  it('should have a callback property', () => {
    expect(new Component().callback).toBeDefined()
  })
  it('addStyle method should add a style', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          this.render('<div></div>')
          this.addStyle({
            this: {
              'background-color': 'red'
            }
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').Style['this']
    })()).toBe('background-color: red;')
  })
  it('addStyle method should add a React style', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          this.render('<div></div>')
          this.addStyle({
            this: {
              backgroundColor: 'red'
            }
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').Style['this']
    })()).toBe('background-color: red;')
  })
  it('querySelector method should return an HTMLElement', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          this.render('<div></div>')
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').querySelector('div')
    })()).toBeInstanceOf(HTMLElement)
  })
  it('should render', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          this.didMount = false
          this.render('<div></div>', (component) => {
            component.didMount = true
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      return document.querySelector('emmy-a').querySelector('div')
    })()).toBeDefined()
  })
})

describe('LightComponent', () => {
  it('should be defined', () => {
    expect(LightComponent).toBeDefined()
  })
  it('should have a render method', () => {
    expect(new LightComponent().render).toBeDefined()
  })
  it('should have a connectedCallback method', () => {
    expect(new LightComponent().connectedCallback).toBeDefined()
  })
  it('should have a querySelector method', () => {
    expect(new LightComponent().querySelector).toBeDefined()
  })
  it('should have a addStyle method', () => {
    expect(new LightComponent().addStyle).toBeDefined()
  })
  it('should have a Style property', () => {
    expect(new LightComponent().Style).toBeDefined()
  })
  it('should have a contentGenerator property', () => {
    expect(new LightComponent().contentGenerator).toBeDefined()
  })
  it('should have a callback property', () => {
    expect(new LightComponent().callback).toBeDefined()
  })
  it('addStyle method should add a style', () => {
    expect((() => {
      class A extends LightComponent {
        constructor() {
          super()
          this.render(() => '<div></div>')
          this.addStyle({
            this: {
              'background-color': 'red'
            }
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').Style['this']
    })()).toBe('background-color: red;')
  })
  it('addStyle method should add a React style', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          this.render('<div></div>')
          this.addStyle({
            this: {
              backgroundColor: 'red'
            }
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').Style['this']
    })()).toBe('background-color: red;')
  })
  it('querySelector method should return an HTMLElement', () => {
    expect((() => {
      class A extends LightComponent {
        constructor() {
          super()
          this.didMount = false
          this.render('<div></div>', (component) => {
            component.didMount = true
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      return document.querySelector('emmy-a').querySelector('div')
    })()).toBeInstanceOf(HTMLElement)
  })
  it('should render', () => {
    expect((() => {
      class A extends LightComponent {
        constructor() {
          super()
          this.didMount = false
          this.render('<div></div>', (component) => {
            component.didMount = true
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      return document.querySelector('emmy-a').querySelector('div')
    })()).toBeDefined()
  })
})

describe('FunctionalComponent', () => {
  it('should be defined', () => {
    expect(FunctionalComponent).toBeDefined()
  })
  it('should have a render method', () => {
    expect(new FunctionalComponent(() => '').render).toBeDefined()
  })
  it('should have a connectedCallback method', () => {
    expect(new FunctionalComponent(() => '').connectedCallback).toBeDefined()
  })
  it('should have a querySelector method', () => {
    expect(new FunctionalComponent(() => '').querySelector).toBeDefined()
  })
  it('should have a addStyle method', () => {
    expect(new FunctionalComponent(() => '').addStyle).toBeDefined()
  })
  it('should have a Style property', () => {
    expect(new FunctionalComponent(() => '').Style).toBeDefined()
  })
  it('should have a contentGenerator property', () => {
    expect(new FunctionalComponent(() => '').contentGenerator).toBeDefined()
  })
  it('should have a callback property', () => {
    expect(new FunctionalComponent(() => '').callback).toBeDefined()
  })
  it('addStyle method should add a style', () => {
    expect((() => {
      class A extends FunctionalComponent {
        constructor() {
          super(() => '<div></div>')
          this.addStyle({
            this: {
              'background-color': 'red'
            }
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').Style['this']
    })()).toBe('background-color: red;')
  })
  it('addStyle method should add a React style', () => {
    expect((() => {
      class A extends FunctionalComponent {
        constructor() {
          super(() => '<div></div>')
          this.addStyle({
            this: {
              backgroundColor: 'red'
            }
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      return document.querySelector('emmy-a').Style['this']
    })()).toBe('background-color: red;')
  })
  it('querySelector method should return an HTMLElement', () => {
    expect((() => {
      class A extends FunctionalComponent {
        constructor() {
          super(() => '<div></div>')
          this.didMount = false
          this.render('<div></div>', (component) => {
            component.didMount = true
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      return document.querySelector('emmy-a').querySelector('div')
    })()).toBeInstanceOf(HTMLElement)
  })
  it('should render', () => {
    expect((() => {
      class A extends FunctionalComponent {
        constructor() {
          super(() => '<div></div>')
          this.didMount = false
          this.render('<div></div>', (component) => {
            component.didMount = true
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      return document.querySelector('emmy-a').querySelector('div')
    })()).toBeDefined()
  })
  it('should render with functional syntax', () => {
    expect((() => {
      const a = () => '<div></div>'
      load(a, 'B')
      document.body.innerHTML = '<emmy-b></emmy-b>'
      return document.querySelector('emmy-b').querySelector('div')
    })()).toBeDefined()
  })
  it ('should render with functional syntax and props', () => {
    expect((() => {
      function a({ props }) {
        return `<div>${props().state()}</div>`
      }
      load(a, 'C')
      document.body.innerHTML = '<emmy-c></emmy-c>'
      awaitDidMount('emmy-c')
      return String(document.querySelector('emmy-c').querySelector('div'))
    })()).toBe('<div>{\'rerenderCount\':0}</div>')
  })
})
