import type { UseCalendarProps } from '../hooks/use-calendar'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendar } from '../hooks/use-calendar'
import { CalendarProvider } from '../hooks/use-calendar-context'

export interface CalendarRootBaseProps extends UseCalendarProps, UsePresenceProps, PolymorphicProps {}
export interface CalendarRootProps extends Assign<HTMLProps<'div'>, CalendarRootBaseProps> {}

export const CalendarRoot = forwardRef<HTMLDivElement, CalendarRootProps>((props, ref) => {
  const [presenceProps, calendarProps] = splitPresenceProps(props)
  const [useCalendarProps, localProps] = createSplitProps<UseCalendarProps>()(calendarProps, [
    'closeOnSelect',
    'defaultOpen',
    'defaultValue',
    'defaultView',
    'disabled',
    'fixedWeeks',
    'focusedValue',
    'format',
    'id',
    'ids',
    'isDateUnavailable',
    'isDateUnavailable',
    'locale',
    'max',
    'maxView',
    'min',
    'minView',
    'name',
    'numOfMonths',
    'onFocusChange',
    'onOpenChange',
    'onValueChange',
    'onViewChange',
    'open',
    'parse',
    'placeholder',
    'positioning',
    'readOnly',
    'selectionMode',
    'startOfWeek',
    'timeZone',
    'translations',
    'value',
    'view',
  ])
  const calendar = useCalendar(useCalendarProps)
  const presence = usePresence(mergeProps({ present: calendar.open }, presenceProps))
  const mergedProps = mergeProps(calendar.getRootProps(), localProps)

  return (
    <CalendarProvider value={calendar}>
      <PresenceProvider value={presence}>
        <ui.div {...mergedProps} ref={ref} />
      </PresenceProvider>
    </CalendarProvider>
  )
})

CalendarRoot.displayName = 'CalendarRoot'
