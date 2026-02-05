import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UsePopoverProps
  extends Optional<Omit<popover.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the popover when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: popover.Context['open']
}

export interface UsePopoverReturn extends popover.Api<PropTypes> {}

export function usePopover(props: UsePopoverProps = {}): UsePopoverReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: popover.Context = {
    'id': useId(),
    dir,
    getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...props,
  }

  const context: popover.Context = {
    ...initialContext,
    open: props.open,
    onOpenChange: useEvent(props.onOpenChange, { sync: true }),
  }

  const [state, send] = useMachine(popover.machine(initialContext), { context })
  return popover.connect(state, send, normalizeProps)
}
