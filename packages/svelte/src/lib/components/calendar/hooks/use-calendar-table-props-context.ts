import type { Accessor } from '$lib/types.js'
import type { TableProps } from '@destyler/calendar'
import { createContext } from '../../../utils/create-context.js'

export interface UseCalendarTablePropsContext extends Accessor<TableProps> {}

export const [CalendarTablePropsProvider, useCalendarTablePropsContext]
  = createContext<UseCalendarTablePropsContext>({
    name: 'CalendarTablePropsContext',
    hookName: 'useCalendarTablePropsContext',
    providerName: '<CalendarTablePropsProvider />',
  })
