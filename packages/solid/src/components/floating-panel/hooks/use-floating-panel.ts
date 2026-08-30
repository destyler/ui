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

  const context = createMemo(() => ({
    id,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...props,
  }))

  const [state, send] = useMachine(floatingPanel.machine(context()), { context })
  const api = createMemo(() => floatingPanel.connect(state, send, normalizeProps))

  createEffect(() => {
    const open = props.open
    if (open !== undefined && open !== api().open) {
      api().setOpen(open)
    }
  })

  return api
}
