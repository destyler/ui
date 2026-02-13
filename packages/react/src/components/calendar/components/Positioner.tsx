import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarPositionerBaseProps extends PolymorphicProps {}
export interface CalendarPositionerProps extends HTMLProps<'div'>, CalendarPositionerBaseProps {}

export const CalendarPositioner = forwardRef<HTMLDivElement, CalendarPositionerProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getPositionerProps(), props)
  const presence = usePresenceContext()

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

CalendarPositioner.displayName = 'CalendarPositioner'
