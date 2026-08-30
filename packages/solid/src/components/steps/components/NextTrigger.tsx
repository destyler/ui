import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface StepsNextTriggerProps extends HTMLProps<'button'>, StepsNextTriggerBaseProps {}

export function StepsNextTrigger(props: StepsNextTriggerProps) {
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getNextTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
