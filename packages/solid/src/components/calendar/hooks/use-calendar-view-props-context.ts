import type { ViewProps } from '@destyler/calendar'
import { createContext } from '~/utils/create-context'

export interface UseCalendarViewContext extends Required<ViewProps> {}

const calendarViewProviderTuple = createContext<UseCalendarViewContext>({
  hookName: 'useCalendarViewContext',
  providerName: '<CalendarViewProvider />',
  strict: false,
  defaultValue: { view: 'day' },
})

export const CalendarViewProvider = calendarViewProviderTuple[0]
export const useCalendarViewContext = calendarViewProviderTuple[1]
