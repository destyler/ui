import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsListBaseProps extends PolymorphicProps<'ol'> {}
export interface StepsListProps extends HTMLProps<'ol'>, StepsListBaseProps {}

export function StepsList(props: StepsListProps) {
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getListProps(), props)

  return <ui.ol {...mergedProps} />
}
