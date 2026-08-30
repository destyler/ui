import type { UseCalendarTableCellContext } from '../hooks/use-calendar-table-cell-props-context'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'
import {
  CalendarTableCellProvider,

} from '../hooks/use-calendar-table-cell-props-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarTableCellBaseProps
  extends UseCalendarTableCellContext,
  PolymorphicProps<'td'> {}
export interface CalendarTableCellProps extends HTMLProps<'td'>, CalendarTableCellBaseProps {}

export function CalendarTableCell(props: CalendarTableCellProps) {
  const [cellProps, localProps] = createSplitProps<UseCalendarTableCellContext>()(props, [
    'disabled',
    'value',
    'visibleRange',
    'columns',
  ])
  const api = useCalendarContext()
  const viewProps = useCalendarViewContext()
  const tableCellProps = createMemo(() => {
    const viewMap = {
      day: api().getDayTableCellProps,
      month: api().getMonthTableCellProps,
      year: api().getYearTableCellProps,
    }

    const viewFn = viewMap[viewProps.view]

    // @ts-expect-error The selected view narrows the matching cell value at runtime.
    return viewFn(cellProps)
  })

  const mergedProps = mergeProps(tableCellProps, localProps)

  return (
    <CalendarTableCellProvider value={cellProps}>
      <ui.td {...mergedProps} />
    </CalendarTableCellProvider>
  )
}
