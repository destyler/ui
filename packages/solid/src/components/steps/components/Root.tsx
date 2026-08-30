import type { UseStepsProps } from '../hooks/use-steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSteps } from '../hooks/use-steps'
import { StepsProvider } from '../hooks/use-steps-context'

export interface StepsRootBaseProps extends UseStepsProps, PolymorphicProps<'div'> {}
export interface StepsRootProps extends HTMLProps<'div'>, StepsRootBaseProps {}

export function StepsRoot(props: StepsRootProps) {
  const [useStepsProps, localProps] = createSplitProps<UseStepsProps>()(props, [
    'defaultStep',
    'id',
    'ids',
    'count',
    'linear',
    'onStepChange',
    'onStepComplete',
    'orientation',
    'step',
  ])

  const steps = useSteps(useStepsProps)
  const mergedProps = mergeProps(() => steps().getRootProps(), localProps)

  return (
    <StepsProvider value={steps}>
      <ui.div {...mergedProps} />
    </StepsProvider>
  )
}
