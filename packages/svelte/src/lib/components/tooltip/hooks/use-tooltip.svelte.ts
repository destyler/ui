import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '@destyler/svelte'
import * as tooltip from '@destyler/tooltip'
import { runIfFn } from '@destyler/utils'

export interface UseTooltipProps
  extends Omit<tooltip.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: tooltip.Context['open']
}
export interface UseTooltipReturn extends Accessor<tooltip.Api<PropTypes>> {}

export function useTooltip(props: MaybeFunction<UseTooltipProps>): UseTooltipReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { open: 'defaultOpen' }, ['open'])
  })

  const [state, send] = useMachine(() => tooltip.machine(machineProps.initial as tooltip.Context), {
    get context() {
      return machineProps.context as tooltip.Context
    },
  })
  const api = $derived(tooltip.connect(state, send, normalizeProps))
  return () => api
}
