import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as dialog from '@destyler/dialog'
import { runIfFn } from '@destyler/utils'

export interface UseDialogProps
  extends Omit<dialog.Context, 'getRootNode' | 'dir' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: dialog.Context['open']
}

export interface UseDialogReturn extends Accessor<dialog.Api<PropTypes>> {}

export function useDialog(props: MaybeFunction<UseDialogProps>): UseDialogReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    return createMachineProps({
      getRootNode: env().getRootNode,
      dir: locale().dir,
      ...resolvedProps,
    }, { open: 'defaultOpen' }, ['open'])
  })

  const [state, send] = useMachine(() => dialog.machine(machineProps.initial as dialog.Context), {
    get context() {
      return machineProps.context as dialog.Context
    },
  })
  const api = $derived(dialog.connect(state, send, normalizeProps))

  return () => api
}
