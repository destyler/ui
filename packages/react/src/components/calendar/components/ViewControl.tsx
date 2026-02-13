import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarViewControlBaseProps extends PolymorphicProps {}
export interface CalendarViewControlProps extends HTMLProps<'div'>, CalendarViewControlBaseProps {}

export const CalendarViewControl = forwardRef<HTMLDivElement, CalendarViewControlProps>((props, ref) => {
  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = mergeProps(calendar.getViewControlProps(viewProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

CalendarViewControl.displayName = 'CalendarViewControl'
