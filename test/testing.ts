import { assert } from 'vitest'

export function expectToBeSubclassOf(actual, expected) {
  const assertMessage = `Expected ${actual.name} to be a subclass of ${expected.name}`
  try {
    const instance = new actual()
    assert(!!instance, assertMessage)
  }
  catch (e) {
    assert.fail(assertMessage)
  }
}

export const restoreGlobalThis = (properties: Record<string, any>) => {
  for (const key in properties) {
    globalThis[key] = properties[key]
  }
}
