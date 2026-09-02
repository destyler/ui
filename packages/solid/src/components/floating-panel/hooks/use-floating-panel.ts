import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createEffect, createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseFloatingPanelProps
  extends Optional<
    Omit<floatingPanel.Context, 'dir' | 'getRootNode' | 'open.controlled'>,
    'id'
  > {
  /**
   * The initial open state of the floating panel when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: floatingPanel.Context['open']
}

export interface UseFloatingPanelReturn extends Accessor<floatingPanel.Api<PropTypes>> {}

export function useFloatingPanel(props: UseFloatingPanelProps = {}): UseFloatingPanelReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  let syncingControlledOpen = false

  const initialContext = createMemo(() => ({
    id,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...props,
    onOpenChange(details: floatingPanel.OpenChangeDetails) {
      if (!syncingControlledOpen)
        props.onOpenChange?.(details)
    },
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    open: props.open,
  }))

  const [state, send] = useMachine(floatingPanel.machine(initialContext()), { context })
  const controlledSend: typeof send = (event) => {
    const eventType = typeof event === 'string' ? event : event.type
    const controlledOpen = props.open
    let requestedOpen: boolean | undefined
    if (eventType === 'OPEN')
      requestedOpen = true
    else if (eventType === 'CLOSE')
      requestedOpen = false
    else if (eventType === 'ESCAPE' && state.matches('open') && state.context.closeOnEscape)
      requestedOpen = false

    if (controlledOpen !== undefined && requestedOpen !== undefined) {
      if (requestedOpen !== controlledOpen)
        props.onOpenChange?.({ open: requestedOpen })
      return
    }

    send(event)
  }
  const api = createMemo(() => floatingPanel.connect(state, controlledSend, normalizeProps))

  createEffect(() => {
    const open = props.open
    if (open !== undefined && open !== api().open) {
      syncingControlledOpen = true
      try {
        send(open ? 'OPEN' : 'CLOSE')
      }
      finally {
        syncingControlledOpen = false
      }
    }
  })

  return api
}
