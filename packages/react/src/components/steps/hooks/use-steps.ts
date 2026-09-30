import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps } from '@destyler/react'
import * as steps from '@destyler/steps'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseStepsProps extends Optional<Omit<steps.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the step
   */
  defaultStep?: number
}

export interface UseStepsReturn extends steps.Api<PropTypes> {}

export function useSteps(props: UseStepsProps = {}): UseStepsReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: steps.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(props),
  }

  const context: steps.Context = {
    ...initialContext,
    ...(props.step !== undefined ? { step: props.step } : {}),
    onStepChange: useEvent(props.onStepChange),
    onStepComplete: useEvent(props.onStepComplete),
  }

  const [state, send] = useMachine(steps.machine(initialContext), {
    context,
  })

  return steps.connect<PropTypes>(state, send, normalizeProps)
}
