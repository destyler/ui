import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableHeaderBaseProps extends PolymorphicProps {}
export interface CalendarTableHeaderProps extends HTMLProps<'th'>, CalendarTableHeaderBaseProps {}

export const CalendarTableHeader = forwardRef<HTMLTableCellElement, CalendarTableHeaderProps>((props, ref) => {
  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()
  const mergedProps = mergeProps(calendar.getTableHeaderProps(tableProps), props)

  return <ui.th {...mergedProps} ref={ref} />
})

CalendarTableHeader.displayName = 'CalendarTableHeader'
