import type { UseCalendarReturn } from './use-calendar'
import { createContext } from '~/utils'

export interface UseCalendarContext extends UseCalendarReturn {}

export const [CalendarProvider, useCalendarContext] = createContext<UseCalendarContext>('CalendarContext')
