import type { Accessor } from 'solid-js'
import { createMemo, createSignal, untrack } from 'solid-js'
import { runIfFn } from '~/utils/run-if-fn'

type AnyFunction = (...args: never[]) => unknown

export interface UseControllableStateProps<T> {
  value?: Accessor<T | undefined>
  defaultValue?: Accessor<T | undefined> | T
  onChange?: (value: T) => void
}

export function useControllableState<T>(props: UseControllableStateProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = createSignal(runIfFn(props.defaultValue))
  const controlled = createMemo(() => props.value?.() !== undefined)

  const currentValue = createMemo(() => (controlled() ? props.value?.() : uncontrolledValue()))

  const setValue = (next: Exclude<T, AnyFunction> | ((prev: T) => T)) => {
    untrack(() => {
      const nextValue = runIfFn(next, currentValue() as T)

      if (controlled()) {
        return props.onChange?.(nextValue)
      }

      setUncontrolledValue(() => nextValue as T)
      return props.onChange?.(nextValue)
    })
  }

  return [currentValue as Accessor<T>, setValue] as const
}
