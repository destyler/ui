import type { Accessor } from '$lib/types.js'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { useEnvironmentContext, useLocaleContext } from '../../../providers/index.js'
import { createMachineProps } from '../../../utils/create-machine-props.js'

export interface UseFloatingPanelProps
  extends Omit<floatingPanel.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: floatingPanel.Context['open']
}
export interface UseFloatingPanelReturn extends Accessor<floatingPanel.Api<PropTypes>> {}

export function useFloatingPanel(props: MaybeFunction<UseFloatingPanelProps>): UseFloatingPanelReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const resolvedProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { open: 'defaultOpen' }, ['open'])
  })

  const [state, send] = useMachine(() => floatingPanel.machine(resolvedProps.initial as floatingPanel.Context), {
    get context() {
      return resolvedProps.context as floatingPanel.Context
    },
  })
  const api = $derived(floatingPanel.connect(state, send, normalizeProps))

  $effect(() => {
    const open = runIfFn(props).open
    if (open !== undefined && open !== api.open)
      api.setOpen(open)
  })

  return () => api
}
