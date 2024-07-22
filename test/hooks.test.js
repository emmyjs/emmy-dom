import { describe, it, expect } from 'vitest'
import { Component, useState } from '../dist/index.js'
// Even VSCode doesn't recognize the usage of HTMLElement, it is necessary to test components
import { HTMLElement } from 'happy-dom'

// @vitest-environment happy-dom

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
      return document.querySelector('emmy-a').getAttribute('state')
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
      return document.querySelector('emmy-a').getAttribute('state')
    })()).toBe('1')
  })
})
