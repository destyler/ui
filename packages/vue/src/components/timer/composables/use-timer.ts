import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as timer from '@destyler/timer'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useEnvironmentContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseTimerProps extends Optional<Omit<timer.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseTimerReturn extends ComputedRef<timer.Api<PropTypes>> {}

export function useTimer(props: UseTimerProps, emit?: EmitFn<RootEmits>): UseTimerReturn {
  const id = useId()
  const env = useEnvironmentContext()

  const context = computed<timer.Context>(() => ({
    id,
    getRootNode: env?.value.getRootNode,
    onComplete: () => emit?.('complete'),
    onTick: details => emit?.('tick', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(timer.machine(context.value), { context })

  return computed(() => timer.connect(state.value, send, normalizeProps))
}
