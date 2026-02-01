import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { ActionTriggerProps } from '@destyler/timer'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerActionTriggerBaseProps extends ActionTriggerProps, PolymorphicProps {}
export interface TimerActionTriggerProps extends HTMLProps<'button'>, TimerActionTriggerBaseProps {}

export const TimerActionTrigger = forwardRef<HTMLButtonElement, TimerActionTriggerProps>((props, ref) => {
  const timer = useTimerContext()
  const mergedProps = mergeProps(timer.getActionTriggerProps(props), props)

  return <ui.button {...mergedProps} ref={ref} />
})

TimerActionTrigger.displayName = 'TimerActionTrigger'
