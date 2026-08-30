import type { ViewProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { calendarAnatomy } from '../anatomy'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { CalendarViewProvider } from '../hooks/use-calendar-view-props-context'

export interface CalendarViewBaseProps extends Required<ViewProps>, PolymorphicProps<'div'> {}
export interface CalendarViewProps extends HTMLProps<'div'>, CalendarViewBaseProps {}

export function CalendarView(props: CalendarViewProps) {
  const [viewProps, localProps] = createSplitProps<Required<ViewProps>>()(props, ['view'])
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => calendarAnatomy.build().view.attrs, localProps)

  return (
    <CalendarViewProvider value={viewProps}>
      <ui.div {...mergedProps} hidden={api().view !== viewProps.view} />
    </CalendarViewProvider>
  )
}
