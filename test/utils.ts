import { assert } from 'vitest'
import { EmmyComponent } from '../src/index.ts'

export function awaitDidMount(componentName) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (document.querySelector(componentName)?.didMount) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

export function attachToDocument(elementName: string = 'emmy-a') {
  document.body.innerHTML = `<${elementName}></${elementName}>`
  awaitDidMount(elementName)
  return document.querySelector(elementName) as EmmyComponent
}

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
