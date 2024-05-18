import { describe, it, expect } from 'vitest'
import styleToCssString  from '../src/react-style-object-to-css'

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
})
