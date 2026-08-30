import type { DayTableCellProps, TableCellProps } from '@destyler/calendar'
import { createContext } from '~/utils/create-context'

type Union<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] | T[K] : T[K]
} & Omit<U, keyof T>

type CellProps = Union<DayTableCellProps, TableCellProps>

export interface UseCalendarTableCellContext extends CellProps {}

const calendarTableCellProviderTuple = createContext<UseCalendarTableCellContext>({
  hookName: 'useCalendarTableCellContext',
  providerName: '<CalendarTableCellProvider />',
})

export const CalendarTableCellProvider = calendarTableCellProviderTuple[0]
export const useCalendarTableCellContext = calendarTableCellProviderTuple[1]
