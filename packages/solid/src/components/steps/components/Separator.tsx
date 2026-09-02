import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'
import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

export interface StepsSeparatorBaseProps extends PolymorphicProps<'div'> {}
export interface StepsSeparatorProps extends HTMLProps<'div'>, StepsSeparatorBaseProps {}

export function StepsSeparator(props: StepsSeparatorProps) {
  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = mergeProps(() => steps().getSeparatorProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
