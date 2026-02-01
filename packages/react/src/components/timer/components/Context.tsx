import type { ReactNode } from 'react'
import type { UseTimerContext } from '../hooks/use-timer-context'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerContextProps {
  children: (context: UseTimerContext) => ReactNode
}

export const TimerContext = (props: TimerContextProps) => props.children(useTimerContext())
