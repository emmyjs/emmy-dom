import { describe, it, expect } from 'vitest'
import { Emmy, loadGlobalEmmy, html, javascript } from '../src/utils.ts'

describe('Emmy', () => {
  it('should be an object', () => {
    expect(Emmy).toBeDefined()
  })

  it('should be empty', () => {
    expect(Emmy).toEqual({})
  })
})

describe('loadGlobalEmmy', () => {
  it('should load an object into Emmy', () => {
    loadGlobalEmmy({ a: 1, b: 2 })
    expect(Emmy).toEqual({ a: 1, b: 2 })
  })
})

describe('html', () => {
  it('should return the same string', () => {
    expect(html`<div></div>`).toBe('<div></div>')
  })
})

describe('javascript', () => {
  it('should return the same string', () => {
    expect(javascript`console.log('Hello, world!')`).toBe('console.log(\'Hello, world!\')')
  })
})
