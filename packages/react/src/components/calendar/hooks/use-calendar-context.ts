import type { UseCalendarReturn } from './use-calendar'
import { createContext } from '~/utils/create-context'

export interface UseCalendarContext extends UseCalendarReturn {}

export const [CalendarProvider, useCalendarContext] = createContext<UseCalendarContext>({
  name: 'CalendarContext',
  hookName: 'useCalendarContext',
  providerName: '<CalendarProvider />',
})
