import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as navigationMenu from '@destyler/navigation-menu'
import { runIfFn } from '@destyler/utils'

export interface UseNavigationMenuProps
  extends Omit<navigationMenu.Context, 'dir' | 'getRootNode' | 'defaultValue' | 'value.controlled' | 'id'> {
  id: string
  defaultValue?: string
}
export interface UseNavigationMenuReturn extends Accessor<navigationMenu.Api<PropTypes>> {}

export function useNavigationMenu(props: MaybeFunction<UseNavigationMenuProps>): UseNavigationMenuReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    const baseProps = {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
    const controlled = resolvedProps.value !== undefined
    const initialValue = controlled ? resolvedProps.value : (resolvedProps.defaultValue ?? null)
    const initialDefaultValue = controlled ? (resolvedProps.value ?? undefined) : resolvedProps.defaultValue
    return {
      initial: {
        ...baseProps,
        'defaultValue': initialDefaultValue,
        'value': initialValue,
        'value.controlled': controlled,
      },
      context: {
        ...baseProps,
        'defaultValue': initialDefaultValue,
        'value': resolvedProps.value,
        'value.controlled': controlled,
      },
    }
  })

  const [state, send] = useMachine(() => navigationMenu.machine(machineProps.initial as navigationMenu.Context), {
    get context() {
      return machineProps.context as navigationMenu.Context
    },
  })
  const api = $derived(navigationMenu.connect(state, send, normalizeProps))
  return () => api
}
