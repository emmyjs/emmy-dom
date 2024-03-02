type placeholderCallback = ((component: object) => void) | ((component?: object) => void) | (() => void)

export type DependencyArray = Array<(() => any) | any>
export type UseState = (initialValue: any) => [() => any, (newValue: any) => void]
export type UseEffect = (callback: placeholderCallback, dependencies: DependencyArray) => void

export function getValues(dependencies: DependencyArray): Array<any> {
  return dependencies.map((dependency) => {
    if (typeof dependency === 'function') {
      return dependency()
    }
    return dependency
  })
}

export function useState(initialValue): [() => any, (newValue: any) => void] {
  let value = initialValue
  const state = () => value
  const setState = (newValue) => {
    value = newValue
  }
  return [state, setState]
}

export function useEffect (callback: placeholderCallback, dependencies: DependencyArray) {
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
  dependencies.find((dependency) => {
    if (typeof dependency === 'string') {
      if (dependency === 'didMount') {
        const oldCallback = this.callback
        this.callback = (component) => {
          oldCallback.call(component, component)
          callback.call(component, component)
        }
      }
    }
    return false
  })
}
