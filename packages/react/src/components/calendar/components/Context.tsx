import type { ReactNode } from 'react'
import type { UseCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarContextProps {
  children: (context: UseCalendarContext) => ReactNode
}

export const CalendarContext = (props: CalendarContextProps) => props.children(useCalendarContext())
