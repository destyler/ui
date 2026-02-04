import type { UseStepsProps } from './use-steps'
import { createSplitProps } from '~/utils/create-split-props'

export function splitStepsProps<T extends UseStepsProps>(props: T) {
  return createSplitProps<UseStepsProps>()(props, [
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
