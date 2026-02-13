import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTableCellPropsContext } from '../hooks/use-calendar-table-cell-props-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarTableCellTriggerBaseProps extends PolymorphicProps {}
export interface CalendarTableCellTriggerProps extends HTMLProps<'div'>, CalendarTableCellTriggerBaseProps {}

export const CalendarTableCellTrigger = forwardRef<HTMLDivElement, CalendarTableCellTriggerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const tableCellProps = useCalendarTableCellPropsContext()
  const viewProps = useCalendarViewPropsContext()

  const viewMap = {
    day: calendar.getDayTableCellTriggerProps,
    month: calendar.getMonthTableCellTriggerProps,
    year: calendar.getYearTableCellTriggerProps,
  }

  const viewFn = viewMap[viewProps.view]

  // @ts-expect-error fix later
  const triggerProps = viewFn(tableCellProps)

  const mergedProps = mergeProps(triggerProps, props)

  return <ui.div ref={ref} {...mergedProps} />
})

CalendarTableCellTrigger.displayName = 'CalendarTableCellTrigger'
