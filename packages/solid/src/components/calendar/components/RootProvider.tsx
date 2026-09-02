import type { UseCalendarReturn } from '../hooks/use-calendar'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CalendarProvider } from '../hooks/use-calendar-context'

interface RootProviderProps {
  value: UseCalendarReturn
}

export interface CalendarRootProviderBaseProps
  extends RootProviderProps,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface CalendarRootProviderProps
  extends HTMLProps<'div'>,
  CalendarRootProviderBaseProps {}

export function CalendarRootProvider(props: CalendarRootProviderProps) {
  const [presenceProps, calendarProps] = splitPresenceProps(props)
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(
    calendarProps,
    ['value'],
  )
  const calendar: UseCalendarReturn = () => providerProps.value()
  const presence = usePresence(mergeProps(() => ({ present: calendar().open }), presenceProps))
  const mergedProps = mergeProps(() => calendar().getRootProps(), localProps)

  return (
    <CalendarProvider value={calendar}>
      <PresenceProvider value={presence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </CalendarProvider>
  )
}
