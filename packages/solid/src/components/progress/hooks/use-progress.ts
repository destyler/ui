import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseProgressProps
  extends Optional<Omit<progress.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the progress when it is first rendered.
   * Use when you do not need to control the state of the progress.
   */
  defaultValue?: progress.Context['value']
}
export interface UseProgressReturn extends Accessor<progress.Api<PropTypes>> {}

export function useProgress(props: UseProgressProps = {}): UseProgressReturn {
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

  const [state, send] = useMachine(progress.machine(initialContext()), { context })
  return createMemo(() => progress.connect(state, send, normalizeProps))
}
