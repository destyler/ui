import type { Optional } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { splitRenderStrategyProps } from '~/utils/render-strategy'

export interface UsePresenceProps
  extends Optional<presence.Context, 'present'>,
  RenderStrategyProps {}
export interface UsePresenceReturn extends ReturnType<typeof usePresence> {}

export function usePresence(props: UsePresenceProps) {
  const [renderStrategyProps, context] = splitRenderStrategyProps(props)
  const [wasEverPresent, setWasEverPresent] = createSignal(false)
  const [state, send] = useMachine(presence.machine(context), {
    context,
  })
  const api = createMemo(() => presence.connect(state, send, normalizeProps))

  createEffect(() => {
    const present = api().present
    if (present)
      setWasEverPresent(true)
  })

  return createMemo(() => ({
    unmounted:
      (!api().present && !wasEverPresent() && renderStrategyProps.lazyMount)
      || (renderStrategyProps.unmountOnExit && !api().present && wasEverPresent()),
    present: api().present,
    presenceProps: {
      'ref': api().setNode,
      'hidden': !api().present,
      'data-state': context.present ? 'open' : 'closed',
    },
  }))
}
