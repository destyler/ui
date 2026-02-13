import type { UseCalendarTableCellPropsContext } from '../hooks/use-calendar-table-cell-props-context'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'
import {
  CalendarTableCellPropsProvider,

} from '../hooks/use-calendar-table-cell-props-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarTableCellBaseProps extends UseCalendarTableCellPropsContext, PolymorphicProps {}
export interface CalendarTableCellProps extends HTMLProps<'td'>, CalendarTableCellBaseProps {}

export const CalendarTableCell = forwardRef<HTMLTableCellElement, CalendarTableCellProps>((props, ref) => {
  const [cellProps, localProps] = createSplitProps<UseCalendarTableCellPropsContext>()(props, [
    'disabled',
    'value',
    'visibleRange',
    'columns',
  ])
  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const tableCellProps = {
    day: calendar.getDayTableCellProps,
    month: calendar.getMonthTableCellProps,
    year: calendar.getYearTableCellProps,
    // @ts-expect-error value is number filter
  }[viewProps.view](cellProps)

  const mergedProps = mergeProps(tableCellProps, localProps)

  return (
    <CalendarTableCellPropsProvider value={cellProps}>
      <ui.td ref={ref} {...mergedProps} />
    </CalendarTableCellPropsProvider>
  )
})

CalendarTableCell.displayName = 'CalendarTableCell'
