import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsProgressBaseProps extends PolymorphicProps<'div'> {}
export interface StepsProgressProps extends HTMLProps<'div'>, StepsProgressBaseProps {}

export function StepsProgress(props: StepsProgressProps) {
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getProgressProps(), props)

  return <ui.div {...mergedProps} />
}
