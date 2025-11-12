type AnyFunction<Arg = unknown, ReturnValue = unknown> = (...args: Arg[]) => ReturnValue

const isFunction = <T = AnyFunction>(value: unknown): value is T => typeof value === 'function'

export function runIfFn<MaybeReturnValue, FunctionArgs>(valueOrFn: MaybeReturnValue | ((...fnArgs: FunctionArgs[]) => MaybeReturnValue), ...args: FunctionArgs[]) {
  return isFunction<AnyFunction<FunctionArgs, MaybeReturnValue>>(valueOrFn)
    ? valueOrFn(...args)
    : (valueOrFn as unknown as MaybeReturnValue)
}
