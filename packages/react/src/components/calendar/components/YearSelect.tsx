import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarYearSelectBaseProps extends PolymorphicProps {}
export interface CalendarYearSelectProps extends HTMLProps<'select'>, CalendarYearSelectBaseProps {}

export const CalendarYearSelect = forwardRef<HTMLSelectElement, CalendarYearSelectProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getYearSelectProps(), props)

  return (
    <ui.select {...mergedProps} ref={ref}>
      {calendar.getYears().map((year, i) => (
        <option key={i} value={year.value}>
          {year.label}
        </option>
      ))}
    </ui.select>
  )
})

CalendarYearSelect.displayName = 'CalendarYearSelect'
