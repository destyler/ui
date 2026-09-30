import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as navigationMenu from '@destyler/navigation-menu'
import { runIfFn } from '@destyler/utils'
import { connectNavigationMenu } from './connect-navigation-menu'

export interface UseNavigationMenuProps
  extends Omit<navigationMenu.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseNavigationMenuReturn extends Accessor<navigationMenu.Api<PropTypes>> {}

export function useNavigationMenu(props: MaybeFunction<UseNavigationMenuProps>): UseNavigationMenuReturn {
  let mounted = $state(false)
  $effect(() => {
    mounted = true
  })
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
      // null explicitly closes the menu; only undefined permits the default seed.
      defaultValue: resolvedProps.value !== undefined ? undefined : resolvedProps.defaultValue,
    })
  })

  const [state, send] = useMachine(() => navigationMenu.machine(machineProps.initial as navigationMenu.Context), {
    get context() {
      return machineProps.context as navigationMenu.Context
    },
  })
  const api = $derived(connectNavigationMenu(state, send, mounted))
  return () => api
}
