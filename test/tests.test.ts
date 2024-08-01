import { describe, it, expect } from 'vitest'
import { restoreGlobalThis } from './testing'

describe('restoreGlobalThis', () => {
  it('should restore globalThis properties', () => {
    restoreGlobalThis({ foo: 'bar' })
    expect(globalThis.foo).toBe('bar')
  })
})

import('happy-dom')
// @vitest-environment happy-dom
describe('@vitest-environment happy-dom', () => {
  it('should work', () => {
    expect(1).toBe(1)
  })
})
