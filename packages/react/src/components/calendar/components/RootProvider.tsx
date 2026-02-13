import type { UseCalendarReturn } from '../hooks/use-calendar'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CalendarProvider } from '../hooks/use-calendar-context'

interface RootProviderProps {
  value: UseCalendarReturn
}

export interface CalendarRootProviderBaseProps extends RootProviderProps, UsePresenceProps, PolymorphicProps {}
export interface CalendarRootProviderProps extends HTMLProps<'div'>, CalendarRootProviderBaseProps {}

export const CalendarRootProvider = forwardRef<HTMLDivElement, CalendarRootProviderProps>((props, ref) => {
  const [presenceProps, calendarProps] = splitPresenceProps(props)
  const [{ value: calendar }, localProps] = createSplitProps<RootProviderProps>()(calendarProps, ['value'])
  const presence = usePresence(mergeProps({ present: calendar.open }, presenceProps))
  const mergedProps = mergeProps(calendar.getRootProps(), localProps)

  return (
    <CalendarProvider value={calendar}>
      <PresenceProvider value={presence}>
        <ui.div {...mergedProps} ref={ref} />
      </PresenceProvider>
    </CalendarProvider>
  )
})

CalendarRootProvider.displayName = 'CalendarRootProvider'
