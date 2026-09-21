import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useMemo } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

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
    ...restProps,
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
