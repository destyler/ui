import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverPositionerProps extends HTMLProps<'div'>, PopoverPositionerBaseProps {}

export function PopoverPositioner(props: PopoverPositionerProps) {
  const api = usePopoverContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(() => api().getPositionerProps(), props)

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
