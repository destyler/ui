import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CalendarTriggerProps extends HTMLProps<'button'>, CalendarTriggerBaseProps {}

export function CalendarTrigger(props: CalendarTriggerProps) {
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => api().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
