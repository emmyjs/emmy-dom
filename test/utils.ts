import { Component } from '../src/index.ts'

export function awaitDidMount(componentName) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (document.querySelector(componentName).didMount) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

export function attachToDocument(elementName: string = 'emmy-a') {
  document.body.innerHTML = `<${elementName}></${elementName}>`
  awaitDidMount(elementName)
  return document.querySelector(elementName) as Component
}
