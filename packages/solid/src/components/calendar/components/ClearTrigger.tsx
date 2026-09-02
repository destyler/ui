import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CalendarClearTriggerProps
  extends HTMLProps<'button'>,
  CalendarClearTriggerBaseProps {}

export function CalendarClearTrigger(props: CalendarClearTriggerProps) {
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => api().getClearTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
