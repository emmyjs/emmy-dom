import { describe, it, expect } from 'vitest'
import { Component, FunctionalComponent, HTMLGenerator } from '../src/index.ts'
import { getValues, useState, useEffect } from '../src/hooks.ts'
import { awaitDidMount } from './utils.ts'
// Even VSCode doesn't recognize the usage of HTMLElement, it is necessary to test components
import { HTMLElement } from 'happy-dom'

// @vitest-environment happy-dom

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
            this.setAttribute('state', state())
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
          this.setAttribute('state', state())
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
      const functionalComponent = ({ el }) => {
        el.useEffect(() => {
          el.setAttribute('callback', 'called')
        })
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
        }, ['didMount'])
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
        }, [state])
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
