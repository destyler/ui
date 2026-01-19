import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCollapseProps extends Optional<Omit<collapse.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the collapse when it is first rendered.
   * Use when you do not need to control the state of the collapse.
   */
  defaultValue?: collapse.Context['value']
}

export interface UseCollapseReturn extends collapse.Api<PropTypes> {}

export function useCollapse(props: UseCollapseProps = {}): UseCollapseReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: collapse.Context = {
    id: useId(),
    dir,
    getRootNode,
    value: props.defaultValue,
    ...props,
  }

  const context: collapse.Context = {
    ...initialContext,
    value: props.value,
    onFocusChange: useEvent(props.onFocusChange),
    onValueChange: useEvent(props.onValueChange),
  }

  const [state, send] = useMachine(collapse.machine(initialContext), { context })
  return collapse.connect(state, send, normalizeProps)
}
