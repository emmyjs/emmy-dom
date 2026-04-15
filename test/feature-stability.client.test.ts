import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { FunctionalComponent, MetaProps, Route, load } from '../src/index.ts'

// @vitest-environment happy-dom

describe('Feature stability: declarative props', () => {
  it('maps class attribute to className in props getter', () => {
    class DeclarativeGetter extends FunctionalComponent {
      constructor() {
        super(() => '<div></div>')
      }

      connectedCallback() {
        super.connectedCallback()
        this.setAttribute('class', 'hero')
        this.setAttribute('title', 'hello')
        this.setAttribute('class-from-props', this.props.className())
        this.setAttribute('title-from-props', this.props.title())
      }
    }

    customElements.define('emmy-declarativegetter', DeclarativeGetter)
    document.body.innerHTML = '<emmy-declarativegetter></emmy-declarativegetter>'

    const element = document.querySelector('emmy-declarativegetter') as HTMLElement
    expect(element.getAttribute('class-from-props')).toBe('hero')
    expect(element.getAttribute('title-from-props')).toBe('hello')
  })

  it('supports declarative props setter including className alias', () => {
    class DeclarativeSetter extends FunctionalComponent {
      constructor() {
        super(({ el }: MetaProps) => {
          el.props = {
            className: 'primary-cta',
            'data-role': 'button'
          }
          return '<div></div>'
        })
      }
    }

    customElements.define('emmy-declarativesetter', DeclarativeSetter)
    document.body.innerHTML = '<emmy-declarativesetter></emmy-declarativesetter>'

    const element = document.querySelector('emmy-declarativesetter') as HTMLElement
    expect(element.className).toBe('primary-cta')
    expect(element.getAttribute('data-role')).toBe('button')
  })

  it('uses meta props helpers (props and children) inside functional constructor context', () => {
    class MetaPropsCoverage extends FunctionalComponent {
      constructor() {
        super(({ el, props, children }: MetaProps) => {
          const propsValue = props()
          const childrenValue = children()
          el.setAttribute('props-helper-type', typeof props)
          el.setAttribute('children-helper-type', typeof children)
          el.setAttribute('props-has-state-reader', String(typeof propsValue.state === 'function'))
          el.setAttribute('children-value', String(childrenValue))
          return '<div>meta</div>'
        })
      }
    }

    customElements.define('emmy-metapropscoverage', MetaPropsCoverage)
    document.body.innerHTML = '<emmy-metapropscoverage></emmy-metapropscoverage>'

    const element = document.querySelector('emmy-metapropscoverage') as HTMLElement
    expect(element.getAttribute('props-helper-type')).toBe('function')
    expect(element.getAttribute('children-helper-type')).toBe('function')
    expect(element.getAttribute('props-has-state-reader')).toBe('true')
    expect(element.getAttribute('children-value')).toBe('')
  })
})

describe('Feature stability: emmy router', () => {
  beforeEach(() => {
    Route.routes = {}
    document.body.innerHTML = ''
    window.history.pushState({}, '', '/')
  })

  it('registers fallback route when attributes are missing', () => {
    const route = document.createElement('emmy-route')
    document.body.appendChild(route)
    expect(Route.routes['/404']).toContain('<emmy-></emmy->')
  })

  it('registers route definitions and renders the root route', async () => {
    await load(() => '<div>home</div>', 'RouterHomeStableA')

    const rootRoute = document.createElement('emmy-route')
    rootRoute.setAttribute('to', 'RouterHomeStableA')
    rootRoute.setAttribute('href', '/')
    document.body.appendChild(rootRoute)

    const routerElement = document.createElement('emmy-router')
    document.body.appendChild(routerElement)

    const router = document.querySelector('emmy-router') as HTMLElement
    expect(Route.routes['/root']).toContain('emmy-routerhomestablea')
    expect(router.innerHTML).toContain('emmy-routerhomestablea')
  })

  it('navigates between routes using window.route without full reload', async () => {
    await load(() => '<div>home</div>', 'RouterHomeStableB')
    await load(() => '<div>about</div>', 'RouterAboutStableB')

    const rootRoute = document.createElement('emmy-route')
    rootRoute.setAttribute('to', 'RouterHomeStableB')
    rootRoute.setAttribute('href', '/')
    document.body.appendChild(rootRoute)

    const aboutRoute = document.createElement('emmy-route')
    aboutRoute.setAttribute('to', 'RouterAboutStableB')
    aboutRoute.setAttribute('href', '/about-stable')
    document.body.appendChild(aboutRoute)

    const routerElement = document.createElement('emmy-router')
    document.body.appendChild(routerElement)

    const router = document.querySelector('emmy-router') as HTMLElement
    expect(router.innerHTML).toContain('emmy-routerhomestableb')

    const preventDefault = vitest.fn()
    const target = { href: '/about-stable' }
    const pushStateSpy = vitest.spyOn(window.history, 'pushState')

    window.route({ target, preventDefault } as unknown as Event)

    expect(preventDefault).toHaveBeenCalled()
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/about-stable')
    pushStateSpy.mockRestore()
  })

  it('skips navigation when target href matches current pathname', async () => {
    await load(() => '<div>same-path</div>', 'RouterSamePathStable')

    const rootRoute = document.createElement('emmy-route')
    rootRoute.setAttribute('to', 'RouterSamePathStable')
    rootRoute.setAttribute('href', '/')
    document.body.appendChild(rootRoute)

    document.body.appendChild(document.createElement('emmy-router'))

    const preventDefault = vitest.fn()
    const pushStateSpy = vitest.spyOn(window.history, 'pushState')

    window.route({ target: { href: '/' }, preventDefault } as unknown as Event)

    expect(preventDefault).toHaveBeenCalled()
    expect(pushStateSpy).not.toHaveBeenCalled()
    pushStateSpy.mockRestore()
  })

  it('renders route content for non-root pathname', async () => {
    await load(() => '<div>about</div>', 'RouterPathStableA')

    const aboutRoute = document.createElement('emmy-route')
    aboutRoute.setAttribute('to', 'RouterPathStableA')
    aboutRoute.setAttribute('href', '/about-direct')
    document.body.appendChild(aboutRoute)

    expect(Route.routes['/about-direct']).toContain('emmy-routerpathstablea')

    const routerNode = document.createElement('emmy-router') as any
    document.body.appendChild(routerNode)
    Object.defineProperty(window.location, 'pathname', {
      value: '/about-direct',
      configurable: true
    })
    routerNode.handleLocation()

    const router = document.querySelector('emmy-router') as HTMLElement
    expect(router.innerHTML).toContain('emmy-routerpathstablea')
  })

  it('renders 404 when no route matches', () => {
    document.body.innerHTML = '<emmy-router></emmy-router>'
    const router = document.querySelector('emmy-router') as HTMLElement
    expect(router.innerHTML).toContain('<h1>404</h1>')
  })
})

describe('Feature stability: functional rendering internals', () => {
  it('covers render branch for non-function non-string generators (jsx success and fallback)', () => {
    class RenderBranchCoverage extends FunctionalComponent {
      constructor() {
        super(() => '<button id="branch-btn">branch</button>')
      }
    }

    customElements.define('emmy-renderbranchcoverage', RenderBranchCoverage)
    document.body.innerHTML = '<emmy-renderbranchcoverage></emmy-renderbranchcoverage>'

    const element = document.querySelector('emmy-renderbranchcoverage') as any

    element.render({ tag: 'div', attrs: { id: 'from-jsx' } } as any)
    element.connectedCallback()
    expect(element.querySelector('#from-jsx')).toBeDefined()

    element.render({ tag: 'span' } as any)
    element.connectedCallback()
    expect(element.querySelector('span')).toBeDefined()

    element.render({ payload: 'fallback' } as any)
    const fallback = element.contentGenerator()
    expect(typeof fallback).toBe('object')
  })

  it('covers patchState, rerender, state and wrapped addEventListener flow', () => {
    class StatefulCoverage extends FunctionalComponent {
      constructor() {
        super(() => '<button id="state-btn">go</button>')
      }
    }

    customElements.define('emmy-statefulcoverage', StatefulCoverage)
    document.body.innerHTML = '<emmy-statefulcoverage></emmy-statefulcoverage>'

    const element = document.querySelector('emmy-statefulcoverage') as any
    const callback = vitest.fn()

    const button = element.querySelector('#state-btn')
    button.addEventListener('click', callback)
    button.dispatchEvent(new Event('click'))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(element.state().rerenderCount).toBe(1)

    element.patchState({ extra: 1 })
    expect(element.state().extra).toBe(1)

    element.rerender()
    expect(element.state().rerenderCount).toBe(2)

    element.setAttribute('state', '')
    expect(element.state()).toEqual({})

    expect(element.querySelector('#does-not-exist')).toBeNull()
  })
})
