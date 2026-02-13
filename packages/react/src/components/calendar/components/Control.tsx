import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarControlBaseProps extends PolymorphicProps {}
export interface CalendarControlProps extends HTMLProps<'div'>, CalendarControlBaseProps {}

export const CalendarControl = forwardRef<HTMLDivElement, CalendarControlProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

CalendarControl.displayName = 'CalendarControl'
