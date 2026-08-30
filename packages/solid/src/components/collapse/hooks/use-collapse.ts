import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCollapseProps
  extends Optional<Omit<collapse.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the collapse when it is first rendered.
   * Use when you do not need to control the state of the color picker.
   */
  defaultValue?: collapse.Context['value']
}
export interface UseCollapseReturn extends Accessor<collapse.Api<PropTypes>> {}

export function useCollapse(props: UseCollapseProps = {}): UseCollapseReturn {
  const id = createUniqueId()
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    value: props.defaultValue,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(collapse.machine(context()), {
    context,
  })

  return createMemo(() => collapse.connect(state, send, normalizeProps))
}
