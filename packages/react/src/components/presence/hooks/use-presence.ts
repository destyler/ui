import type { Optional } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/react'
import { useRef } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useSafeLayoutEffect } from '~/hooks/use-safe-layout-effect'

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

  const [state, send, service] = useMachine(presence.machine(context), { context })
  const api = presence.connect(state, send, normalizeProps)
  const nodeRef = useRef<HTMLElement | null>(null)
  const setNode = useEvent(api.setNode)
  // Keep ref ownership stable: repeated NODE.SET events during commits change
  // the external-store snapshot again and can create a render loop.
  const ref = useEvent((node: HTMLElement | null) => {
    nodeRef.current = node
    if (node && service.status === 'Running') {
      setNode(node)
    }
  })
  // Core starts in an earlier layout effect. Register after that start, also
  // restoring the node after StrictMode's stop/start effect replay.
  useSafeLayoutEffect(() => {
    if (nodeRef.current) {
      setNode(nodeRef.current)
    }
  }, [service, setNode])

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
    ref,
    getPresenceProps,
    present: api.present,
    unmounted,
  }
}
