import { describe, it, expect } from 'vitest'
import 'happy-dom'

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

describe('emmy-dom', () => {
  it('should work', () => {
    expect(1).toBe(1)
  })
})
