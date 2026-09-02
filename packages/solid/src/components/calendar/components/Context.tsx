import type { JSX } from 'solid-js'
import type { UseCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarContextProps {
  children: (context: UseCalendarContext) => JSX.Element
}

export function CalendarContext(props: CalendarContextProps) {
  return props.children(useCalendarContext())
}
