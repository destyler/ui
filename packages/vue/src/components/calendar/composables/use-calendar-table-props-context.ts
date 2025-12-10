import type { TableProps } from '@destyler/calendar'
import { createContext } from '~/utils'

export interface CalendarTablePropsContext extends TableProps {}

export const [CalendarTablePropsProvider, useCalendarTablePropsContext]
  = createContext<CalendarTablePropsContext>('CalendarTablePropsContext')
