type placeholderCallback = ((component: object) => void) | ((component?: object) => void) | (() => void);
export type DependencyArray = Array<(() => any) | any>;
export type UseState = <T>(initialValue: T) => [() => T, (newValue: T) => void];
export type UseEffect = (callback: placeholderCallback, dependencies: DependencyArray, isServerFunction?: () => boolean) => void;
export interface Hoakable {
    effectCallback: (component: object) => void;
    callback: (component: object) => void;
    useEffect: UseEffect;
    useState: UseState;
}
export declare function bindHooks(component: Hoakable): void;
export declare function getValues(dependencies: DependencyArray): Array<any>;
export declare function useState<T>(initialValue: T): [() => T, (newValue: T) => void];
export declare function useEffect(callback: placeholderCallback, dependencies: DependencyArray, isServerFunction?: () => boolean): void;
export declare function useRef<T>(value?: T): {
    current: T;
};
export {};
