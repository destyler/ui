import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarRangeTextBaseProps extends PolymorphicProps<'div'> {}
export interface CalendarRangeTextProps extends HTMLProps<'div'>, CalendarRangeTextBaseProps {}

export function CalendarRangeText(props: CalendarRangeTextProps) {
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => api().getRangeTextProps(), props)

  return <ui.div {...mergedProps}>{api().visibleRangeText.start}</ui.div>
}
