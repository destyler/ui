import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerControlBaseProps extends PolymorphicProps {}
export interface TimerControlProps extends HTMLProps<'div'>, TimerControlBaseProps {}

export const TimerControl = forwardRef<HTMLDivElement, TimerControlProps>((props, ref) => {
  const timer = useTimerContext()
  const mergedProps = mergeProps(timer.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TimerControl.displayName = 'TimerControl'
