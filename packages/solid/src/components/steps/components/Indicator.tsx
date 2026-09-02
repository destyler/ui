import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'
import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

export interface StepsIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface StepsIndicatorProps extends HTMLProps<'div'>, StepsIndicatorBaseProps {}

export function StepsIndicator(props: StepsIndicatorProps) {
  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = mergeProps(() => steps().getIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
