import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsListBaseProps extends PolymorphicProps<'div'> {}
export interface StepsListProps extends HTMLProps<'div'>, StepsListBaseProps {}

export function StepsList(props: StepsListProps) {
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getListProps(), props)

  return <ui.div {...mergedProps} />
}
