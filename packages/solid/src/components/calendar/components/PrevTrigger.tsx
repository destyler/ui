import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CalendarPrevTriggerProps
  extends HTMLProps<'button'>,
  CalendarPrevTriggerBaseProps {}

export function CalendarPrevTrigger(props: CalendarPrevTriggerProps) {
  const api = useCalendarContext()
  const viewProps = useCalendarViewContext()
  const mergedProps = mergeProps(() => api().getPrevTriggerProps(viewProps), props)

  return <ui.button {...mergedProps} />
}
