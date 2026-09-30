import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps } from '@destyler/react'
import { useId, useMemo } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseFloatingPanelProps
  extends Optional<Omit<floatingPanel.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial open state of the floating panel when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: floatingPanel.Context['open']
}

export interface UseFloatingPanelReturn extends floatingPanel.Api<PropTypes> {}

export function useFloatingPanel(props: UseFloatingPanelProps = {}): UseFloatingPanelReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const {
    onOpenChange,
    onPositionChange,
    onPositionChangeEnd,
    onSizeChange,
    onSizeChangeEnd,
    onStageChange,
    ...restProps
  } = props

  const initialContext: floatingPanel.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(restProps),
  }

  const context: floatingPanel.Context = {
    ...initialContext,
    onOpenChange: useEvent(onOpenChange),
    onPositionChange: useEvent(onPositionChange),
    onPositionChangeEnd: useEvent(onPositionChangeEnd),
    onSizeChange: useEvent(onSizeChange),
    onSizeChangeEnd: useEvent(onSizeChangeEnd),
    onStageChange: useEvent(onStageChange),
  }

  const [state, send] = useMachine(floatingPanel.machine(initialContext), { context })
  return useMemo(() => floatingPanel.connect(state, send, normalizeProps), [state, send])
}
