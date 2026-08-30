import type { ItemProps } from '@destyler/steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsContentBaseProps extends PolymorphicProps<'div'>, ItemProps {}
export interface StepsContentProps extends HTMLProps<'div'>, StepsContentBaseProps {}

export function StepsContent(props: StepsContentProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index'])
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getContentProps(itemProps), localProps)

  return <ui.div {...mergedProps} />
}
