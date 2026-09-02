import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTableContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableBodyBaseProps extends PolymorphicProps<'tbody'> {}
export interface CalendarTableBodyProps
  extends HTMLProps<'tbody'>,
  CalendarTableBodyBaseProps {}

export function CalendarTableBody(props: CalendarTableBodyProps) {
  const api = useCalendarContext()
  const tableProps = useCalendarTableContext()
  const mergedProps = mergeProps(() => api().getTableBodyProps(tableProps), props)

  return <ui.tbody {...mergedProps} />
}
