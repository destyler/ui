import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as menu from '@destyler/menu'
import { runIfFn } from '@destyler/utils'

export interface UseMenuProps
  extends Omit<menu.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: menu.Context['open']
}
export interface UseMenuReturn
  extends Accessor<{
    api: menu.Api<PropTypes>
    service: menu.Service
  }> {}

export function useMenu(props: MaybeFunction<UseMenuProps>): UseMenuReturn {
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

  const [state, send, service] = useMachine(() => menu.machine(machineProps.initial as menu.Context), {
    get context() {
      return machineProps.context as menu.Context
    },
  })
  const api = $derived(menu.connect(state, send, normalizeProps))

  return () => ({ api, service })
}
