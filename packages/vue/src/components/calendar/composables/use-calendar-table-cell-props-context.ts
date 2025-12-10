import type { DateValue, DayTableCellProps, TableCellProps } from '@destyler/calendar'
import type { Reactive } from 'vue'
import { createContext } from '~/utils'

export interface CalendarTableCellPropsContext
  extends Omit<TableCellProps, 'value'>,
  Omit<DayTableCellProps, 'value'> {
  value: Reactive<number | DateValue>
}

export const [CalendarTableCellPropsProvider, useCalendarTableCellPropsContext]
  = createContext<CalendarTableCellPropsContext>('CalendarTableCellPropsContext')
