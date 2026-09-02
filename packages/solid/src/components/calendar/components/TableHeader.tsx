import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTableContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableHeaderBaseProps extends PolymorphicProps<'th'> {}
export interface CalendarTableHeaderProps
  extends HTMLProps<'th'>,
  CalendarTableHeaderBaseProps {}

export function CalendarTableHeader(props: CalendarTableHeaderProps) {
  const api = useCalendarContext()
  const tableProps = useCalendarTableContext()
  const mergedProps = mergeProps(() => api().getTableHeaderProps(tableProps), props)

  return <ui.th {...mergedProps} />
}
