import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CalendarNextTriggerProps
  extends HTMLProps<'button'>,
  CalendarNextTriggerBaseProps {}

export function CalendarNextTrigger(props: CalendarNextTriggerProps) {
  const api = useCalendarContext()
  const viewProps = useCalendarViewContext()
  const mergedProps = mergeProps(() => api().getNextTriggerProps(viewProps), props)

  return <ui.button {...mergedProps} />
}
