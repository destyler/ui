import type { TableProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef, useId } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { CalendarTablePropsProvider } from '../hooks/use-calendar-table-props-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarTableBaseProps extends Pick<TableProps, 'columns'>, PolymorphicProps {}
export interface CalendarTableProps extends HTMLProps<'table'>, CalendarTableBaseProps {}

export const CalendarTable = forwardRef<HTMLTableElement, CalendarTableProps>((props, ref) => {
  const [{ columns }, localProps] = createSplitProps<Pick<TableProps, 'columns'>>()(props, ['columns'])
  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const tableProps = { columns, id: useId(), ...viewProps }
  const mergedProps = mergeProps(calendar.getTableProps(tableProps), localProps)

  return (
    <CalendarTablePropsProvider value={tableProps}>
      <ui.table {...mergedProps} ref={ref} />
    </CalendarTablePropsProvider>
  )
})

CalendarTable.displayName = 'CalendarTable'
