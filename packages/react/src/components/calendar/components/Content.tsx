import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useComposedRefs } from '~/utils/compose-refs'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarContentBaseProps extends PolymorphicProps {}
export interface CalendarContentProps extends HTMLProps<'div'>, CalendarContentBaseProps {}

export const CalendarContent = forwardRef<HTMLDivElement, CalendarContentProps>((props, ref) => {
  const calendar = useCalendarContext()
  const presence = usePresenceContext()
  const composedRef = useComposedRefs(presence.ref, ref)
  const mergedProps = mergeProps(calendar.getContentProps(), presence.getPresenceProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composedRef} />
})

CalendarContent.displayName = 'CalendarContent'
