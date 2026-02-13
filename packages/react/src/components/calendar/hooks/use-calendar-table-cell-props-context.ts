import type { DayTableCellProps, TableCellProps } from '@destyler/calendar'
import { createContext } from '~/utils/create-context'

type Union<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] | T[K] : T[K]
} & Omit<U, keyof T>

type CellProps = Union<DayTableCellProps, TableCellProps>

export interface UseCalendarTableCellPropsContext extends CellProps {}

export const [CalendarTableCellPropsProvider, useCalendarTableCellPropsContext]
  = createContext<UseCalendarTableCellPropsContext>({
    name: 'CalendarTableCellContext',
    hookName: 'useCalendarTableCellContext',
    providerName: '<CalendarTableCellProvider />',
  })
