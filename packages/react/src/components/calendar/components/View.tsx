import type { ViewProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { calendarAnatomy } from '../anatomy'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { CalendarViewPropsProvider } from '../hooks/use-calendar-view-props-context'

export interface CalendarViewBaseProps extends Required<ViewProps>, PolymorphicProps {}
export interface CalendarViewProps extends HTMLProps<'div'>, CalendarViewBaseProps {}

export const CalendarView = forwardRef<HTMLDivElement, CalendarViewProps>((props, ref) => {
  const [viewProps, localProps] = createSplitProps<Required<ViewProps>>()(props, ['view'])
  const calendar = useCalendarContext()

  return (
    <CalendarViewPropsProvider value={viewProps}>
      <ui.div
        hidden={calendar.view !== viewProps.view}
        {...calendarAnatomy.build().view.attrs}
        {...localProps}
        ref={ref}
      />
    </CalendarViewPropsProvider>
  )
})

CalendarView.displayName = 'CalendarView'
