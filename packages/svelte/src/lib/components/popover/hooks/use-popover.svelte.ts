import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as popover from '@destyler/popover'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UsePopoverProps
  extends Omit<popover.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: popover.Context['open']
}

export interface UsePopoverReturn extends Accessor<popover.Api<PropTypes>> {}

export function usePopover(props: MaybeFunction<UsePopoverProps>): UsePopoverReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { open: 'defaultOpen' }, ['open'])
  })

  const [state, send] = useMachine(() => popover.machine(machineProps.initial as popover.Context), {
    get context() {
      return machineProps.context as popover.Context
    },
  })
  const api = $derived(popover.connect(state, send, normalizeProps))

  return () => api
}
