import type { ActionTriggerProps } from '@destyler/timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerActionTriggerBaseProps
  extends ActionTriggerProps,
  PolymorphicProps<'button'> {}
export interface TimerActionTriggerProps extends HTMLProps<'button'>, TimerActionTriggerBaseProps {}

export function TimerActionTrigger(props: TimerActionTriggerProps) {
  const timer = useTimerContext()
  const mergedProps = mergeProps(() => timer().getActionTriggerProps(props), props)

  return <ui.button {...mergedProps} />
}
