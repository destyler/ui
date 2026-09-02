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

function eventType(event: unknown) {
  if (typeof event === 'string')
    return event
  if (event && typeof event === 'object' && 'type' in event)
    return String((event as { type: unknown }).type)
  return ''
}

export function usePresence(props: UsePresenceProps) {
  const [renderStrategyProps, presenceProps] = splitRenderStrategyProps(props)
  const [wasEverPresent, setWasEverPresent] = createSignal(false)

  const context = createMemo(() => ({
    ...presenceProps,
    present: presenceProps.present,
    immediate: presenceProps.immediate,
    onExitComplete: presenceProps.onExitComplete,
  }))

  const [state, send, service] = useMachine(presence.machine(context()), { context })

  const requestedPresent = () => Boolean(presenceProps.present)

  const guardedSend: typeof send = (event) => {
    const type = eventType(event)
    if ((type === 'UNMOUNT' || type === 'UNMOUNT.SUSPEND') && requestedPresent())
      return
    send(event)
  }

  service.send = guardedSend

  const api = createMemo(() => presence.connect(state, guardedSend, normalizeProps))

  createEffect(() => {
    if (api().present)
      setWasEverPresent(true)
  })

  createEffect(() => {
    if (requestedPresent() && !api().present)
      guardedSend({ type: 'MOUNT' })
  })

  return createMemo(() => ({
    unmounted:
      (!requestedPresent()
        && !api().present
        && !wasEverPresent()
        && renderStrategyProps.lazyMount)
      || (renderStrategyProps.unmountOnExit
        && !requestedPresent()
        && !api().present
        && wasEverPresent()),
    present: api().present,
    presenceProps: {
      'ref': api().setNode,
      'hidden': !api().present,
      'data-state': requestedPresent() ? 'open' : 'closed',
    },
  }))
}
