import type { Optional } from '$lib/types'
import type { RenderStrategyProps } from '$lib/utils/render-strategy'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { normalizeProps } from '$lib/utils/normalize-props'
import { splitRenderStrategyProps } from '$lib/utils/render-strategy'
import * as presence from '@destyler/presence'
import { runIfFn } from '@destyler/utils'

export interface UsePresenceProps extends Optional<presence.Context, 'present'>, RenderStrategyProps {
  /**
   * Whether to allow the initial presence animation.
   * @default false
   */
  skipAnimationOnMount?: boolean
}
export interface UsePresenceReturn extends ReturnType<typeof usePresence> {}

export function usePresence(props: MaybeFunction<UsePresenceProps>) {
  const resolvedProps = $derived(runIfFn(props))
  const [renderStrategyProps, machineProps] = $derived(splitRenderStrategyProps(resolvedProps))

  const [state, send] = useMachine(() => presence.machine(machineProps as presence.Context), {
    get context() {
      return machineProps as presence.Context
    },
  })
  const api = $derived(presence.connect(state, send, normalizeProps))

  let wasEverPresent = $state(false)

  $effect(() => {
    if (api.present) {
      wasEverPresent = true
    }
  })

  const setNode = (node: Element | null) => {
    api.setNode(node as HTMLElement | null)
  }

  const unmounted = $derived(
    (!api.present && !wasEverPresent && renderStrategyProps.lazyMount)
    || (renderStrategyProps.unmountOnExit && !api.present && wasEverPresent),
  )

  const result = $derived({
    getPresenceProps: () => ({
      'data-state':
        api.skip && resolvedProps.skipAnimationOnMount ? undefined : resolvedProps.present ? 'open' : 'closed',
      'hidden': !api.present,
    }),
    present: api.present,
    setNode,
    unmounted,
  })

  return () => result
}
