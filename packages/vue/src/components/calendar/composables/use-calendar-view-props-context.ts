import type { ViewProps } from '@destyler/calendar'
import { createContext } from '~/utils'

export interface CalendarViewPropsContext extends Required<ViewProps> {}

export const [CalendarViewPropsProvider, useCalendarViewPropsContext]
  = createContext<CalendarViewPropsContext>('CalendarViewPropsContext')
