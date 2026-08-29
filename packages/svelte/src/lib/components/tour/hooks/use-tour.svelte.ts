import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext, useLocaleContext } from '$lib/providers'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as tour from '@destyler/tour'
import { runIfFn } from '@destyler/utils'

export interface UseTourProps extends Omit<tour.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}

export interface UseTourReturn extends Accessor<tour.Api<PropTypes>> {}

export function useTour(props: MaybeFunction<UseTourProps>): UseTourReturn {
  const env = useEnvironmentContext() ?? {}
  const locale = useLocaleContext() ?? {}

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => tour.machine(machineProps as tour.Context), {
    get context() {
      return machineProps as tour.Context
    },
  })
  const api = $derived(tour.connect(state, send, normalizeProps))

  return () => api
}
