type placeholderCallback<T = any> = ((component: T) => void) | ((component?: T) => void) | (() => void);
export type DependencyArray = Array<(() => any) | any>;
export type UseState = <T>(initialValue: T) => [() => T, (newValue: T) => void];
export type UseEffect<T = any> = (callback: placeholderCallback<T>, dependencies: DependencyArray, isServerFunction?: () => boolean) => void;
export interface Hoakable<T = any> {
    effectCallback: (component: T) => void;
    callback: (component: T) => void;
    useEffect: UseEffect<T>;
    useState: UseState;
}
export declare function bindHooks(component: Hoakable): void;
export declare function getValues(dependencies: DependencyArray): Array<any>;
export declare function useState<T>(this: any, initialValue: T): [() => T, (newValue: T) => void];
export declare function useEffect<T>(this: Hoakable<T>, callback: placeholderCallback<T>, dependencies: DependencyArray, isServerFunction?: () => boolean): void;
export declare function useRef<T>(value?: T): {
    current: T | undefined;
};
export {};
