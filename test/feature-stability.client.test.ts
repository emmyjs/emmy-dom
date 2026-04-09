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
})

describe('Feature stability: emmy router', () => {
  beforeEach(() => {
    Route.routes = {}
    document.body.innerHTML = ''
    window.history.pushState({}, '', '/')
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

  it('renders 404 when no route matches', () => {
    document.body.innerHTML = '<emmy-router></emmy-router>'
    const router = document.querySelector('emmy-router') as HTMLElement
    expect(router.innerHTML).toContain('<h1>404</h1>')
  })
})
