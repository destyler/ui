import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseHoverCardProps
  extends Optional<Omit<hoverCard.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial open state of the hover card when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: hoverCard.Context['open']
}

export interface UseHoverCardReturn extends hoverCard.Api<PropTypes> {}

export function useHoverCard(props: UseHoverCardProps = {}): UseHoverCardReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: hoverCard.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(props),
  }

  const context: hoverCard.Context = {
    ...initialContext,
    ...(props.open !== undefined ? { open: props.open } : {}),
    onOpenChange: useEvent(props.onOpenChange, { sync: true }),
  }

  const [state, send] = useMachine(hoverCard.machine(initialContext), { context })

  return hoverCard.connect(state, send, normalizeProps)
}
