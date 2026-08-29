import type { Accessor } from '$lib/types.js'
import type { ViewProps } from '@destyler/calendar'
import { createContext } from '../../../utils/create-context.js'

export interface UseCalendarViewPropsContext extends Accessor<ViewProps> {}

export const [CalendarViewPropsProvider, useCalendarViewPropsContext]
  = createContext<UseCalendarViewPropsContext>({
    name: 'CalendarViewPropsContext',
    hookName: 'useCalendarViewPropsContext',
    providerName: '<CalendarViewPropsProvider />',
  })
