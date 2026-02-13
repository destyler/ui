import type { ViewProps } from '@destyler/calendar'
import { createContext } from '~/utils/create-context'

export interface UseCalendarViewContext extends Required<ViewProps> {}

export const [CalendarViewPropsProvider, useCalendarViewPropsContext] = createContext<UseCalendarViewContext>({
  name: 'CalendarViewContext',
  hookName: 'useCalendarViewContext',
  providerName: '<CalendarViewProvider />',
  strict: false,
  defaultValue: { view: 'day' },
})
