import { isServer } from './utils.js'

type placeholderCallback = ((component: object) => void) | ((component?: object) => void) | (() => void)

export type DependencyArray = Array<(() => any) | any>
export type UseState = <T>(initialValue: T) => [() => T, (newValue: T) => void]
export type UseEffect = (callback: placeholderCallback, dependencies: DependencyArray, isServerFunction?: () => boolean) => void

export interface Hoakable {
  effectCallback: (component: object) => void
  callback: (component: object) => void
  useEffect: UseEffect
  useState: UseState
}

export function bindHooks(component: Hoakable) {
  component.useState = useState.bind(component)
  component.useEffect = useEffect.bind(component)
}

export function getValues(dependencies: DependencyArray): Array<any> {
  return dependencies.map((dependency) => {
    if (typeof dependency === 'function') {
      return dependency()
    }
    return dependency
  })
}

export function useState<T>(initialValue: T): [() => T, (newValue: T) => void] {
  let value = initialValue
  const state = () => value
  const setState = (newValue) => {
    value = newValue
  }
  return [state, setState]
}

export function useEffect(callback: placeholderCallback, dependencies: DependencyArray, isServerFunction: () => boolean = isServer) {
  if (isServerFunction()) {
    console.warn('Skipping useEffect on server')
    return
  }
  const oldEffectCallback = this.effectCallback
  if (!dependencies || dependencies.length === 0) {
    this.effectCallback = (component) => {
      oldEffectCallback(component)
      callback.call(component, component)
    }
    return
  }
  let oldDependencies = getValues(dependencies)
  this.effectCallback = (component) => {
    oldEffectCallback(component)
    const newDependencies = getValues(dependencies)
    if (JSON.stringify(oldDependencies) !== JSON.stringify(newDependencies)) {
      oldDependencies = newDependencies
      callback.call(component, component)
    }
  }
  let didMount = false
  dependencies.find((dependency) => {
    if (typeof dependency === 'string') {
      if (dependency === 'didMount') {
        const oldCallback = this.callback
        this.callback = (component) => {
          oldCallback.call(component, component)
          if (didMount) return
          didMount = true
          callback.call(component, component)
        }
      }
    }
    return false
  })
}

export function useRef<T>(value?: T) {
  return { current: value }
}
