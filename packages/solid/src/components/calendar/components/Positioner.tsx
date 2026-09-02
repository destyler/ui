import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface CalendarPositionerProps
  extends HTMLProps<'div'>,
  CalendarPositionerBaseProps {}

export function CalendarPositioner(props: CalendarPositionerProps) {
  const api = useCalendarContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(() => api().getPositionerProps(), props)

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
