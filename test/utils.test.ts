import { describe, it, expect } from 'vitest'
import { processGenerator, parseCSS, createInlineStyle, capitalizeFirstLetter, uncapitalizeFirstLetter, Emmy, loadGlobalEmmy, html, javascript } from '../src/utils.ts'

describe('processGenerator', () => {
  it('should return a string', () => {
    expect(processGenerator('<Div></Div>')).toBe('<emmy-div ></emmy-div >')
    expect(processGenerator('<Div color="red"></Div>')).toBe('<emmy-div color="red"></emmy-div >')
    expect(processGenerator('<Div />')).toBe('<emmy-div ></emmy-div >')
    //expect(processGenerator('<Div color="red" />')).toBe('<emmy-div color="red" ></emmy-div >')
  })
})

describe('parseCSS', () => {
  it('should return an object', () => {
    expect(parseCSS('color: red; background-color: blue;'))
      .toEqual({ color: 'red', 'background-color': 'blue' })
  })
})

describe('createInlineStyle', () => {
  it('should return a string', () => {
    expect(createInlineStyle({ color: 'red', backgroundColor: 'blue' }))
      .toBe('color: red; background-color: blue;')
    expect(createInlineStyle('color: red; background-color: blue;'))
      .toBe('color: red; background-color: blue;')
  })
})

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello')
  })
})

describe('uncapitalizeFirstLetter', () => {
  it('should uncapitalize the first letter of a string', () => {
    expect(uncapitalizeFirstLetter('Hello')).toBe('hello')
  })
})

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
