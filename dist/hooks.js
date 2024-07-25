import { isServer } from './utils.js';
export function getValues(dependencies) {
    return dependencies.map((dependency) => {
        if (typeof dependency === 'function') {
            return dependency();
        }
        return dependency;
    });
}
export function useState(initialValue) {
    let value = initialValue;
    const state = () => value;
    const setState = (newValue) => {
        value = newValue;
    };
    return [state, setState];
}
export function useEffect(callback, dependencies, isServerFunction = isServer) {
    if (isServerFunction()) {
        console.warn('Skipping useEffect on server');
        return;
    }
    const oldEffectCallback = this.effectCallback;
    if (!dependencies || dependencies.length === 0) {
        this.effectCallback = (component) => {
            oldEffectCallback(component);
            callback.call(component, component);
        };
        return;
    }
    let oldDependencies = getValues(dependencies);
    this.effectCallback = (component) => {
        oldEffectCallback(component);
        const newDependencies = getValues(dependencies);
        if (JSON.stringify(oldDependencies) !== JSON.stringify(newDependencies)) {
            oldDependencies = newDependencies;
            callback.call(component, component);
        }
    };
    dependencies.find((dependency) => {
        if (typeof dependency === 'string') {
            if (dependency === 'didMount') {
                const oldCallback = this.callback;
                this.callback = (component) => {
                    oldCallback.call(component, component);
                    callback.call(component, component);
                };
            }
        }
        return false;
    });
}
export function useRef(value) {
    return { current: value };
}
