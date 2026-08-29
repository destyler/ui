import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as collapsible from '@destyler/collapsible'
import { runIfFn } from '@destyler/utils'

export interface UseCollapsibleProps
  extends Omit<collapsible.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: collapsible.Context['open']
  /**
   * Whether the content should be lazy mounted
   */
  lazyMount?: boolean
  /**
   * Whether the content should be unmounted when collapsed
   */
  unmountOnExit?: boolean
  /**
   * Callback fired when the animation ends
   */
  onExitComplete?: () => void
}

export interface UseCollapsibleReturn extends Accessor<collapsible.Api<PropTypes> & { isUnmounted: boolean }> {}

export function useCollapsible(props: MaybeFunction<UseCollapsibleProps>): UseCollapsibleReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  let wasVisible = $state(false)

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    const { lazyMount, unmountOnExit, ...collapsibleProps } = resolvedProps || {}
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...collapsibleProps,
    }, { open: 'defaultOpen' }, ['open'])
  })

  const [state, send] = useMachine(() => collapsible.machine(machineProps.initial as collapsible.Context), {
    get context() {
      return machineProps.context as collapsible.Context
    },
  })
  const api = $derived(collapsible.connect(state, send, normalizeProps))

  const resolvedProps = $derived(runIfFn(props))

  // Track if content was ever visible
  $effect(() => {
    if (api.visible) {
      wasVisible = true
    }
  })

  const isUnmounted = $derived.by(() => {
    const { lazyMount, unmountOnExit } = resolvedProps || {}
    return (!api.visible && !wasVisible && lazyMount) || (unmountOnExit && !api.visible && wasVisible)
  })

  return () => ({ ...api, isUnmounted: Boolean(isUnmounted) })
}
