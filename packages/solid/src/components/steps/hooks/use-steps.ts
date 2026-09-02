import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as steps from '@destyler/steps'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseStepsProps extends Optional<Omit<steps.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the step
   */
  defaultStep?: number
}

export interface UseStepsReturn extends Accessor<steps.Api<PropTypes>> {}

export function useSteps(props: UseStepsProps = {}): UseStepsReturn {
  const environment = useEnvironmentContext()
  const locale = useLocaleContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    step: props.defaultStep,
    ...props,
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    step: props.step,
  }))

  const [state, send] = useMachine(steps.machine(initialContext()), { context })

  return createMemo(() => steps.connect<PropTypes>(state, send, normalizeProps))
}
