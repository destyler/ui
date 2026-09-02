import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTableContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableRowBaseProps extends PolymorphicProps<'tr'> {}
export interface CalendarTableRowProps extends HTMLProps<'tr'>, CalendarTableRowBaseProps {}

export function CalendarTableRow(props: CalendarTableRowProps) {
  const api = useCalendarContext()
  const tableProps = useCalendarTableContext()
  const mergedProps = mergeProps(() => api().getTableRowProps(tableProps), props)

  return <ui.tr {...mergedProps} />
}
