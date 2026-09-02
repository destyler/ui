import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarLabelBaseProps extends PolymorphicProps<'label'> {}
export interface CalendarLabelProps extends HTMLProps<'label'>, CalendarLabelBaseProps {}

export function CalendarLabel(props: CalendarLabelProps) {
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
