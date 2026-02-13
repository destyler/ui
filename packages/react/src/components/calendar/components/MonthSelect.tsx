import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarMonthSelectBaseProps extends PolymorphicProps {}
export interface CalendarMonthSelectProps extends HTMLProps<'select'>, CalendarMonthSelectBaseProps {}

export const CalendarMonthSelect = forwardRef<HTMLSelectElement, CalendarMonthSelectProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getMonthSelectProps(), props)

  return (
    <ui.select {...mergedProps} ref={ref}>
      {calendar.getMonths().map((month, i) => (
        <option key={i} value={month.value}>
          {month.label}
        </option>
      ))}
    </ui.select>
  )
})

CalendarMonthSelect.displayName = 'CalendarMonthSelect'
