import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableBodyBaseProps extends PolymorphicProps {}
export interface CalendarTableBodyProps extends HTMLProps<'tbody'>, CalendarTableBodyBaseProps {}

export const CalendarTableBody = forwardRef<HTMLTableSectionElement, CalendarTableBodyProps>((props, ref) => {
  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()
  const mergedProps = mergeProps(calendar.getTableBodyProps(tableProps), props)

  return <ui.tbody {...mergedProps} ref={ref} />
})

CalendarTableBody.displayName = 'CalendarTableBody'
