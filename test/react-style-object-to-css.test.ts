import { describe, it, expect } from 'vitest'
import styleToCssString, { buildRule }  from '../src/react-style-object-to-css'

describe('react-style-object-to-css', () => {
  it('should convert style object to css string', () => {
    const style = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    }
    expect(styleToCssString(style)).toBe(
      'display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px;'
    )
  })
  it('should avoid falsy and void style passed', () => {
    expect(styleToCssString(undefined)).toBe('')
    expect(styleToCssString({})).toBe('')
  })
  it('should convert style object with nested array to css string', () => {
    const style = {
      border: ['1px', 'solid', 'red']
    }
    expect(styleToCssString(style)).toBe(
      'border: 1px; border: solid; border: red;'
    )
  })
})

describe('buildRule', () => {
  it('should build rule with px unit', () => {
    expect(buildRule('width', 100)).toBe('width: 100px; ')
  })
  it('should build rule with content', () => {
    // eslint-disable-next-line quotes
    expect(buildRule('content', "''")).toBe("content: '\\'\\''; ")
  })
})
