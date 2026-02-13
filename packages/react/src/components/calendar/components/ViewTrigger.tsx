import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarViewTriggerBaseProps extends PolymorphicProps {}
export interface CalendarViewTriggerProps extends HTMLProps<'button'>, CalendarViewTriggerBaseProps {}

export const CalendarViewTrigger = forwardRef<HTMLButtonElement, CalendarViewTriggerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = mergeProps(calendar.getViewTriggerProps(viewProps), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CalendarViewTrigger.displayName = 'CalendarViewTrigger'
