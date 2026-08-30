import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsCompletedContentBaseProps extends PolymorphicProps<'div'> {}
export interface StepsCompletedContentProps
  extends HTMLProps<'div'>,
  StepsCompletedContentBaseProps {}

export function StepsCompletedContent(props: StepsCompletedContentProps) {
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getContentProps({ index: steps().count }), props)

  return <ui.div {...mergedProps} />
}
