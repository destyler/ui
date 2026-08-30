import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarViewControlBaseProps extends PolymorphicProps<'div'> {}
export interface CalendarViewControlProps
  extends HTMLProps<'div'>,
  CalendarViewControlBaseProps {}

export function CalendarViewControl(props: CalendarViewControlProps) {
  const api = useCalendarContext()
  const viewProps = useCalendarViewContext()
  const mergedProps = mergeProps(() => api().getViewControlProps(viewProps), props)

  return <ui.div {...mergedProps} />
}
