import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps } from '@destyler/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseTooltipProps
  extends Optional<Omit<tooltip.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial open state of the tooltip when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: tooltip.Context['open']
}

export interface UseTooltipReturn extends tooltip.Api<PropTypes> {}

export function useTooltip(props: UseTooltipProps = {}): UseTooltipReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: tooltip.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(props),
  }

  const context: tooltip.Context = {
    ...initialContext,
    onOpenChange: useEvent(props.onOpenChange, { sync: true }),
  }

  const [state, send] = useMachine(tooltip.machine(initialContext), { context })

  return tooltip.connect(state, send, normalizeProps)
}
