import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarPrevTriggerBaseProps extends PolymorphicProps {}
export interface CalendarPrevTriggerProps extends HTMLProps<'button'>, CalendarPrevTriggerBaseProps {}

export const CalendarPrevTrigger = forwardRef<HTMLButtonElement, CalendarPrevTriggerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = mergeProps(calendar.getPrevTriggerProps(viewProps), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CalendarPrevTrigger.displayName = 'CalendarPrevTrigger'
