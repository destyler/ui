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
  extends Omit<navigationMenu.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseNavigationMenuReturn extends Accessor<navigationMenu.Api<PropTypes>> {}

export function useNavigationMenu(props: MaybeFunction<UseNavigationMenuProps>): UseNavigationMenuReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const context = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => navigationMenu.machine(context as navigationMenu.Context), {
    get context() {
      return context as navigationMenu.Context
    },
  })
  const api = $derived(navigationMenu.connect(state, send, normalizeProps))
  return () => api
}
