import { describe, it, expect } from 'vitest'
import { Component, LightComponent, load, launch, createPageComponent, FunctionalComponent, ClassComponent } from '../src/server.ts'
import { expectToBeSubclassOf } from './testing.ts'
import { attachToDocument } from './dom.server.ts'

describe('load', () => {
  it('should load a component with an invalid type as Functional Component', async () => {
    expectToBeSubclassOf(await load(Error as unknown as ClassComponent, 'Invalid'), FunctionalComponent)
  })
})

describe('launch', () => {
  it('should warn when launching the same component twice', async () => {
    const warn = console.warn
    let warnCount = 0
    console.warn = () => warnCount++
    class G extends Component {
      constructor() {
        super()
        this.render = () => '<div></div>'
      }
    }
    const numberOfLaunches = 3
    for (let i = 0; i < numberOfLaunches; i++) {
      launch(G as unknown as Component, 'G')
    }
    console.warn = warn
    expect(warnCount).toBe(numberOfLaunches - 1)
  })
})

describe('createPageComponent', () => {
  it('should create a page component', async () => {
    const component = await createPageComponent('https://github.com/', 'G')
    expectToBeSubclassOf(component, FunctionalComponent)
  }, 30000)
})
