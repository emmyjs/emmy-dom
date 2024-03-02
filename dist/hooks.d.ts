type placeholderCallback = ((component: object) => void) | ((component?: object) => void) | (() => void);
export type DependencyArray = Array<(() => any) | any>;
export type UseState = (initialValue: any) => [() => any, (newValue: any) => void];
export type UseEffect = (callback: placeholderCallback, dependencies: DependencyArray) => void;
export declare function getValues(dependencies: DependencyArray): Array<any>;
export declare function useState(initialValue: any): [() => any, (newValue: any) => void];
export declare function useEffect(callback: placeholderCallback, dependencies: DependencyArray): void;
export {};
