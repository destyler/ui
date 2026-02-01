import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerSeparatorBaseProps extends PolymorphicProps {}
export interface TimerSeparatorProps extends HTMLProps<'div'>, TimerSeparatorBaseProps {}

export const TimerSeparator = forwardRef<HTMLDivElement, TimerSeparatorProps>((props, ref) => {
  const timer = useTimerContext()

  const mergedProps = mergeProps(timer.getSeparatorProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TimerSeparator.displayName = 'TimerSeparator'
