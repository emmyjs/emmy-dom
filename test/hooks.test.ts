import { describe, it, expect, vitest } from 'vitest'
import { Component, FunctionalComponent, HTMLGenerator, MetaProps } from '../src/index.ts'
import { getValues, useState, useEffect, useRef, bindHooks, Hoakable } from '../src/hooks.ts'
import { awaitDidMount } from './utils.ts'
// Even VSCode doesn't recognize the usage of HTMLElement, it is necessary to test components
import { HTMLElement } from 'happy-dom'

// @vitest-environment happy-dom

const isServerMock = vitest.fn(() => false)

describe('getValues', () => {
  it('should be defined', () => {
    expect(getValues).toBeDefined()
  })
  it('should return an array', () => {
    expect(getValues([])).toEqual([])
  })
  it('should return an array of values', () => {
    expect(getValues([() => 1, 2, () => 3])).toEqual([1, 2, 3])
  })
})

describe('useState', () => {
  it('should be defined', () => {
    expect(useState).toBeDefined()
  })
  it('should return a state', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          const [state, setState] = useState(0)
          this.render('<div></div>', () => {
            this.setAttribute('state', state().toString())
          })
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      const emmyElement = document.querySelector('emmy-a')
      return emmyElement?.getAttribute('state')
    })()).toBe('0')
  })
  it('should update a state', () => {
    expect((() => {
      class A extends Component {
        constructor() {
          super()
          this.render('<div></div>')
          const [state, setState] = useState(0)
          setState(1)
          this.setAttribute('state', state().toString())
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      const emmyElement = document.querySelector('emmy-a')
      return emmyElement?.getAttribute('state')
    })()).toBe('1')
  })
})

describe('useEffect', () => {
  it('should be defined', () => {
    expect(useEffect).toBeDefined()
  })
  it('should call a callback', () => {
    expect((() => {
      const functionalComponent = ({ el }: MetaProps) => {
        el.useEffect(() => {
          el.setAttribute('callback', 'called')
        }, [], isServerMock)
        return ''
      }
      class A extends FunctionalComponent {
        constructor() {
          super(functionalComponent as HTMLGenerator)
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      const emmyElement = document.querySelector('emmy-a')
      return emmyElement?.getAttribute('callback')
    })()).toBe('called')

    expect((() => {
      const functionalComponent = ({ el }) => {
        el.useEffect(() => {
          el.setAttribute('callback', 'called')
        }, ['didMount'], isServerMock)
        return ''
      }
      class A extends FunctionalComponent {
        constructor() {
          super(functionalComponent as HTMLGenerator)
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      const emmyElement = document.querySelector('emmy-a')
      return emmyElement?.getAttribute('callback')
    })()).toBe('called')
  })
  it('should call a callback with dependencies', () => {
    expect((() => {
      const functionalComponent = ({ el }) => {
        const [state, setState] = useState(0)
        el.useEffect(() => {
          el.setAttribute('callback', state())
        }, [state], isServerMock)
        setState(1)
        return ''
      }
      class A extends FunctionalComponent {
        constructor() {
          super(functionalComponent as HTMLGenerator)
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      const emmyElement = document.querySelector('emmy-a')
      return emmyElement?.getAttribute('callback')
    })()).toBe('1')
  })
})

describe('bindHooks', () => {
  it('should be defined', () => {
    expect(bindHooks).toBeDefined()
  })
  it('should bind hooks', () => {
    class A extends Component {
      constructor() {
        super()
      }
    }
    const componentToBind = new A() as FunctionalComponent
    bindHooks(componentToBind as Hoakable)
    expect(componentToBind.useState).toBeDefined()
    expect(componentToBind.useEffect).toBeDefined()
  })
})

describe('useRef', () => {
  it('should be defined', () => {
    expect(useRef).toBeDefined()
  })
  it('should return a ref', () => {
    expect((() => {
      const functionalComponent = ({ el } : MetaProps) => {
        const ref = useRef(0)
        el.setAttribute('ref', ref.current!.toString())
        return ''
      }
      class A extends FunctionalComponent {
        constructor() {
          super(functionalComponent as HTMLGenerator)
        }
      }
      customElements.define('emmy-a', A)
      document.body.innerHTML = '<emmy-a></emmy-a>'
      awaitDidMount('emmy-a')
      const emmyElement = document.querySelector('emmy-a')
      return emmyElement?.getAttribute('ref')
    })()).toBe('0')
  })
})
