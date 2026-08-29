import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as hoverCard from '@destyler/hover-card'
import { runIfFn } from '@destyler/utils'

export interface UseHoverCardProps
  extends Omit<hoverCard.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: hoverCard.Context['open']
}
export interface UseHoverCardReturn extends Accessor<hoverCard.Api<PropTypes>> {}

export function useHoverCard(props: MaybeFunction<UseHoverCardProps>): UseHoverCardReturn {
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

  const [state, send] = useMachine(() => hoverCard.machine(machineProps.initial as hoverCard.Context), {
    get context() {
      return machineProps.context as hoverCard.Context
    },
  })
  const api = $derived(hoverCard.connect(state, send, normalizeProps))

  return () => api
}
