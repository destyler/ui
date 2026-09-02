import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'
import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

export interface StepsTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface StepsTriggerProps extends HTMLProps<'button'>, StepsTriggerBaseProps {}

export function StepsTrigger(props: StepsTriggerProps) {
  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = mergeProps({ type: 'button' }, () => steps().getTriggerProps(itemProps), props)

  return <ui.button {...mergedProps} />
}
