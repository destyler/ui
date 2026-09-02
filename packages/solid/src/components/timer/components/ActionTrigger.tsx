import type { ActionTriggerProps } from '@destyler/timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerActionTriggerBaseProps
  extends ActionTriggerProps,
  PolymorphicProps<'button'> {}
export interface TimerActionTriggerProps extends HTMLProps<'button'>, TimerActionTriggerBaseProps {}

export function TimerActionTrigger(props: TimerActionTriggerProps) {
  const [actionTriggerProps, localProps] = createSplitProps<ActionTriggerProps>()(props, ['action'])
  const timer = useTimerContext()
  const mergedProps = mergeProps(
    () => timer().getActionTriggerProps(actionTriggerProps),
    localProps,
  )

  return <ui.button {...mergedProps} />
}
