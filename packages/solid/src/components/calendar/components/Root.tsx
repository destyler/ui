import type { UseCalendarProps } from '../hooks/use-calendar'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendar } from '../hooks/use-calendar'
import { CalendarProvider } from '../hooks/use-calendar-context'

export interface CalendarRootBaseProps
  extends UseCalendarProps,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface CalendarRootProps extends HTMLProps<'div'>, CalendarRootBaseProps {}

export function CalendarRoot(props: CalendarRootProps) {
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
  const api = useCalendar(useCalendarProps)
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })))
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <CalendarProvider value={api}>
      <PresenceProvider value={apiPresence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </CalendarProvider>
  )
}
