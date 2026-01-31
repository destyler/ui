import type { Optional } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/react'
import { useRef } from 'react'
import { useEvent } from '~/hooks/use-event'

export interface UsePresenceProps extends Optional<presence.Context, 'present'>, RenderStrategyProps {}
export type UsePresenceReturn = ReturnType<typeof usePresence>

export function usePresence(props: UsePresenceProps) {
  const { lazyMount, unmountOnExit, present, ...rest } = props
  const wasEverPresent = useRef(false)
  const context: Partial<presence.Context> = {
    ...rest,
    present,
    onExitComplete: useEvent(props.onExitComplete),
  }

  const [state, send] = useMachine(presence.machine(context), { context })
  const api = presence.connect(state, send, normalizeProps)

  if (api.present) {
    wasEverPresent.current = true
  }

  const unmounted
    = (!api.present && !wasEverPresent.current && lazyMount) || (unmountOnExit && !api.present && wasEverPresent.current)

  const getPresenceProps = () => ({
    'data-state': present ? 'open' : 'closed',
    'hidden': !api.present,
  })

  return {
    ref: api.setNode,
    getPresenceProps,
    present: api.present,
    unmounted,
  }
}
