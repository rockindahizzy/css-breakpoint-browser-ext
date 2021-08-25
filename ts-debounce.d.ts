export declare type Procedure = (...args: any[]) => any;
export declare type Options<TT> = {
  isImmediate?: boolean;
  maxWait?: number;
  callback?: (data: TT) => void;
};
export interface DebouncedFunction<F extends Procedure> {
  (this: ThisParameterType<F>, ...args: Parameters<F>): Promise<ReturnType<F>>;
  cancel: (reason?: any) => void;
}
export declare function debounce<F extends Procedure>(func: F, waitMilliseconds?: number, options?: Options<ReturnType<F>>): DebouncedFunction<F>;
