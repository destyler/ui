import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarControlBaseProps extends PolymorphicProps<'div'> {}
export interface CalendarControlProps extends HTMLProps<'div'>, CalendarControlBaseProps {}

export function CalendarControl(props: CalendarControlProps) {
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
