import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface StepsPrevTriggerProps extends HTMLProps<'button'>, StepsPrevTriggerBaseProps {}

export function StepsPrevTrigger(props: StepsPrevTriggerProps) {
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getPrevTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
