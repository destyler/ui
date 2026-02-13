import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarTriggerBaseProps extends PolymorphicProps {}
export interface CalendarTriggerProps extends HTMLProps<'button'>, CalendarTriggerBaseProps {}

export const CalendarTrigger = forwardRef<HTMLButtonElement, CalendarTriggerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CalendarTrigger.displayName = 'CalendarTrigger'
