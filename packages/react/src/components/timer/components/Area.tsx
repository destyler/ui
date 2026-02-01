import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerAreaBaseProps extends PolymorphicProps {}
export interface TimerAreaProps extends HTMLProps<'div'>, TimerAreaBaseProps {}

export const TimerArea = forwardRef<HTMLDivElement, TimerAreaProps>((props, ref) => {
  const timer = useTimerContext()
  const mergedProps = mergeProps(timer.getAreaProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TimerArea.displayName = 'TimerArea'
