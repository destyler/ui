import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarNextTriggerBaseProps extends PolymorphicProps {}
export interface CalendarNextTriggerProps extends HTMLProps<'button'>, CalendarNextTriggerBaseProps {}

export const CalendarNextTrigger = forwardRef<HTMLButtonElement, CalendarNextTriggerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = mergeProps(calendar.getNextTriggerProps(viewProps), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CalendarNextTrigger.displayName = 'CalendarNextTrigger'
