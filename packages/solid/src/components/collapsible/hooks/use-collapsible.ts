import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createEffect, createMemo, createSignal, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { splitRenderStrategyProps } from '~/utils/render-strategy'

export interface UseCollapsibleProps
  extends Optional<Omit<collapsible.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'>,
  RenderStrategyProps {
  /**
   * The initial open state of the collapsible when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: collapsible.Context['open']
}

export interface UseCollapsibleReturn
  extends Accessor<
    collapsible.Api<PropTypes> & {
      /**
       * Whether the content is unmounted
       */
      unmounted?: boolean
    }
  > {}

export function useCollapsible(props: UseCollapsibleProps = {}): UseCollapsibleReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const [renderStrategyProps, collapsibleProps] = splitRenderStrategyProps(props)
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...collapsibleProps,
  }))
  const [state, send] = useMachine(collapsible.machine(context()), { context })
  const [wasVisible, setWasVisible] = createSignal(false)
  const api = createMemo(() => collapsible.connect(state, send, normalizeProps))

  createEffect(() => {
    const isPresent = api().visible
    if (isPresent)
      setWasVisible(true)
  })

  return createMemo(() => ({
    ...api(),
    unmounted:
      (!api().visible && !wasVisible() && renderStrategyProps.lazyMount)
      || (renderStrategyProps.unmountOnExit && !api().visible && wasVisible()),
  }))
}
