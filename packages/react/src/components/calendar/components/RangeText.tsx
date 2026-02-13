import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarRangeTextBaseProps extends PolymorphicProps {}
export interface CalendarRangeTextProps extends HTMLProps<'div'>, CalendarRangeTextBaseProps {}

export const CalendarRangeText = forwardRef<HTMLDivElement, CalendarRangeTextProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getRangeTextProps(), props)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {calendar.visibleRangeText.start}
    </ui.div>
  )
})

CalendarRangeText.displayName = 'CalendarRangeText'
