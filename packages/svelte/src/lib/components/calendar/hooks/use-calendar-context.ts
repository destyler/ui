import type { Accessor } from '$lib/types.js'
import type * as calendar from '@destyler/calendar'
import type { PropTypes } from '@destyler/svelte'
import { createContext } from '../../../utils/create-context.js'

export interface UseCalendarContext extends Accessor<calendar.Api<PropTypes>> {}

export const [CalendarProvider, useCalendarContext] = createContext<UseCalendarContext>({
  name: 'CalendarContext',
  hookName: 'useCalendarContext',
  providerName: '<CalendarProvider />',
})
