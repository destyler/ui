import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseHoverCardProps
  extends Optional<Omit<hoverCard.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the hover card when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: hoverCard.Context['open']
}
export interface UseHoverCardReturn extends Accessor<hoverCard.Api<PropTypes>> {}

export function useHoverCard(props: UseHoverCardProps = {}): UseHoverCardReturn {
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

  const [state, send] = useMachine(hoverCard.machine(initialContext()), { context })
  return createMemo(() => hoverCard.connect(state, send, normalizeProps))
}
