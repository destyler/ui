import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as timer from '@destyler/timer'
import { runIfFn } from '@destyler/utils'

export interface UseTimerProps extends Omit<timer.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseTimerReturn extends Accessor<timer.Api<PropTypes>> {}

export function useTimer(props: MaybeFunction<UseTimerProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => timer.machine(machineProps as timer.Context), {
    get context() {
      return machineProps as timer.Context
    },
  })
  const api = $derived(timer.connect(state, send, normalizeProps))
  return () => api
}
