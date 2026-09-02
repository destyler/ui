import type { UseCalendarReturn } from './use-calendar'
import { createContext } from '~/utils/create-context'

export interface UseCalendarContext extends UseCalendarReturn {}

const calendarProviderTuple = createContext<UseCalendarContext>({
  hookName: 'useCalendarContext',
  providerName: '<CalendarProvider />',
})

export const CalendarProvider = calendarProviderTuple[0]
export const useCalendarContext = calendarProviderTuple[1]
