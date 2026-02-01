import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as toggleGroup from '@destyler/toggle'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseToggleGroupProps extends Optional<Omit<toggleGroup.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the toggle group when it is first rendered.
   * Use when you do not need to control the state of the toggle group.
   */
  defaultValue?: toggleGroup.Context['value']
}

export interface UseToggleGroupReturn extends toggleGroup.Api<PropTypes> {}

export function useToggleGroup(props: UseToggleGroupProps = {}): UseToggleGroupReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: toggleGroup.Context = {
    id: useId(),
    dir,
    getRootNode,
    value: props.defaultValue,
    ...props,
  }

  const context: toggleGroup.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
  }

  const [state, send] = useMachine(toggleGroup.machine(initialContext), {
    context,
  })

  return toggleGroup.connect(state, send, normalizeProps)
}
