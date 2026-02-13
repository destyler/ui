import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context'

export interface CalendarTableHeadBaseProps extends PolymorphicProps {}
export interface CalendarTableHeadProps extends HTMLProps<'thead'>, CalendarTableHeadBaseProps {}

export const CalendarTableHead = forwardRef<HTMLTableSectionElement, CalendarTableHeadProps>((props, ref) => {
  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()
  const mergedProps = mergeProps(calendar.getTableHeadProps(tableProps), props)

  return <ui.thead {...mergedProps} ref={ref} />
})

CalendarTableHead.displayName = 'CalendarTableHead'
