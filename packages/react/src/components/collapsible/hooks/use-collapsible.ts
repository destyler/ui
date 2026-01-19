import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useRef } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCollapsibleProps
  extends Optional<Omit<collapsible.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'>,
  RenderStrategyProps {
  /**
   * The initial open state of the collapsible when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: collapsible.Context['open']
}

export interface UseCollapsibleReturn extends collapsible.Api<PropTypes> {
  /**
   * Whether the content is unmounted
   */
  isUnmounted?: boolean
}

export function useCollapsible(props: UseCollapsibleProps = {}): UseCollapsibleReturn {
  const { lazyMount, unmountOnExit, ...collapsibleProps } = props
  const wasVisible = useRef(false)
  const { dir } = useLocaleContext()
  const { getRootNode } = useEnvironmentContext()

  const initialContext: collapsible.Context = {
    'id': useId(),
    dir,
    getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...collapsibleProps,
  }

  const context: collapsible.Context = {
    ...initialContext,
    open: props.open,
    onOpenChange: useEvent(props.onOpenChange, { sync: true }),
  }

  const [state, send] = useMachine(collapsible.machine(initialContext), { context })
  const api = collapsible.connect(state, send, normalizeProps)

  if (api.visible) {
    wasVisible.current = true
  }

  const isUnmounted
    = (!api.visible && !wasVisible.current && lazyMount) || (unmountOnExit && !api.visible && wasVisible.current)

  return { ...api, isUnmounted }
}
