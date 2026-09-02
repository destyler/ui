import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tooltip from '@destyler/tooltip'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTooltipProps
  extends Optional<Omit<tooltip.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the tooltip when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: tooltip.Context['open']
}
export interface UseTooltipReturn extends Accessor<tooltip.Api<PropTypes>> {}

export function useTooltip(props: UseTooltipProps = {}): UseTooltipReturn {
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

  const [state, send] = useMachine(tooltip.machine(initialContext()), { context })
  return createMemo(() => tooltip.connect(state, send, normalizeProps))
}
