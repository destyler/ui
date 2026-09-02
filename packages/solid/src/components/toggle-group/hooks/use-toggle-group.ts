import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as toggleGroup from '@destyler/toggle'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseToggleGroupProps
  extends Optional<Omit<toggleGroup.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the toggle group when it is first rendered.
   * Use when you do not need to control the state of the toggle group.
   */
  defaultValue?: toggleGroup.Context['value']
}
export interface UseToggleGroupReturn extends Accessor<toggleGroup.Api<PropTypes>> {}

export function useToggleGroup(props: UseToggleGroupProps = {}): UseToggleGroupReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    value: props.defaultValue,
    ...props,
  }))
  const context = createMemo(() => ({
    ...initialContext(),
    value: props.value,
  }))
  const [state, send] = useMachine(toggleGroup.machine(initialContext()), {
    context,
  })

  return createMemo(() => toggleGroup.connect(state, send, normalizeProps))
}
