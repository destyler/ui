import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarViewTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CalendarViewTriggerProps
  extends HTMLProps<'button'>,
  CalendarViewTriggerBaseProps {}

export function CalendarViewTrigger(props: CalendarViewTriggerProps) {
  const api = useCalendarContext()
  const viewProps = useCalendarViewContext()
  const mergedProps = mergeProps(() => api().getViewTriggerProps(viewProps), props)

  return <ui.button {...mergedProps} />
}
