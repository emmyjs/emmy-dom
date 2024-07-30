import { describe, it, expect } from 'vitest'
import '../register'

describe('window', () => {
  it('should work if re-included', () => {
    import('../register')
  })

  it('Object', () => {
    expect(window.Object).toBeDefined()
    expect(window.Object).toEqual(global.Object)
  })

  it('customElements should be an object', () => {
    expect(typeof customElements).toEqual('object')
  })
})
