import { computed } from 'vue'
import { useEmitAsProps } from './use-emits-as-props'
import { useForwardProps } from './use-forward-props'

export function useForwardPropsEmits<
  T extends Parameters<typeof useForwardProps>[0],
  Name extends string,
>(props: T, emit?: (name: Name, ...args: any[]) => void) {
  const parsedProps = useForwardProps(props)
  const emitsAsProps = emit ? useEmitAsProps(emit) : {}

  return computed(() => ({
    // @ts-expect-error ignore ts error
    ...parsedProps.value,
    ...emitsAsProps,
  }))
}
