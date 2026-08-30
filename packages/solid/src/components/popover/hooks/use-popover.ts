import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UsePopoverProps
  extends Optional<Omit<popover.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the popover when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: popover.Context['open']
}
export interface UsePopoverReturn extends Accessor<popover.Api<PropTypes>> {}

export function usePopover(props: UsePopoverProps = {}): UsePopoverReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...props,
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    open: props.open,
  }))

  const [state, send] = useMachine(popover.machine(initialContext()), { context })
  return createMemo(() => popover.connect(state, send, normalizeProps))
}
