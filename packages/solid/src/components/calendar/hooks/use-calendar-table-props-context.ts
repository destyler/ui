import type { TableProps } from '@destyler/calendar'
import { createContext } from '~/utils/create-context'

export interface UseCalendarTableContext extends TableProps {}

const calendarTableProviderTuple = createContext<UseCalendarTableContext>({
  hookName: 'useCalendarTableContext',
  providerName: '<CalendarTableProvider />',
})

export const CalendarTableProvider = calendarTableProviderTuple[0]
export const useCalendarTableContext = calendarTableProviderTuple[1]
