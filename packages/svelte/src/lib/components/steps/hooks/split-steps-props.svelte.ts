import type { Optional } from '$lib/types'
import type { UseStepsProps } from './use-steps.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type StepsMachineProps = Optional<UseStepsProps, 'id'>

const splitProps = createSplitProps<StepsMachineProps>()

export function splitStepsProps<T extends StepsMachineProps>(props: T) {
  return splitProps(props, [
    'count',
    'defaultStep',
    'id',
    'ids',
    'linear',
    'onStepChange',
    'onStepComplete',
    'orientation',
    'step',
  ])
}
