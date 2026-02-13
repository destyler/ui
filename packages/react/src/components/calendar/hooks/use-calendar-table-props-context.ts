import type { TableProps } from '@destyler/calendar'
import { createContext } from '~/utils/create-context'

export interface UseCalendarTablePropsContext extends TableProps {}

export const [CalendarTablePropsProvider, useCalendarTablePropsContext]
  = createContext<UseCalendarTablePropsContext>({
    name: 'CalendarTableContext',
    hookName: 'useCalendarTableContext',
    providerName: '<CalendarTableProvider />',
  })
