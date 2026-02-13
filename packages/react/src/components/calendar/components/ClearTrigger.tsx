import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarClearTriggerBaseProps extends PolymorphicProps {}
export interface CalendarClearTriggerProps extends HTMLProps<'button'>, CalendarClearTriggerBaseProps {}

export const CalendarClearTrigger = forwardRef<HTMLButtonElement, CalendarClearTriggerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getClearTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CalendarClearTrigger.displayName = 'CalendarClearTrigger'
