import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableRowBaseProps extends PolymorphicProps {}
export interface CalendarTableRowProps extends HTMLProps<'tr'>, CalendarTableRowBaseProps {}

export const CalendarTableRow = forwardRef<HTMLTableRowElement, CalendarTableRowProps>((props, ref) => {
  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()
  const mergedProps = mergeProps(calendar.getTableRowProps(tableProps), props)

  return <ui.tr {...mergedProps} ref={ref} />
})

CalendarTableRow.displayName = 'CalendarTableRow'
