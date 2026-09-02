import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTableContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableHeadBaseProps extends PolymorphicProps<'thead'> {}
export interface CalendarTableHeadProps
  extends HTMLProps<'thead'>,
  CalendarTableHeadBaseProps {}

export function CalendarTableHead(props: CalendarTableHeadProps) {
  const api = useCalendarContext()
  const tableProps = useCalendarTableContext()
  const mergedProps = mergeProps(() => api().getTableHeadProps(tableProps), props)

  return <ui.thead {...mergedProps} />
}
