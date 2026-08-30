import type { TableProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { CalendarTableProvider } from '../hooks/use-calendar-table-props-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarTableBaseProps
  extends Pick<TableProps, 'columns'>,
  PolymorphicProps<'table'> {}
export interface CalendarTableProps extends HTMLProps<'table'>, CalendarTableBaseProps {}

export function CalendarTable(props: CalendarTableProps) {
  const [{ columns }, localProps] = createSplitProps<Pick<TableProps, 'columns'>>()(props, [
    'columns',
  ])
  const api = useCalendarContext()
  const viewProps = useCalendarViewContext()
  const tableProps = { columns, id: createUniqueId(), ...viewProps }
  const mergedProps = mergeProps(() => api().getTableProps(tableProps), localProps)

  return (
    <CalendarTableProvider value={tableProps}>
      <ui.table {...mergedProps} />
    </CalendarTableProvider>
  )
}
