import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverContentBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverContentProps extends HTMLProps<'div'>, PopoverContentBaseProps {}

export function PopoverContent(props: PopoverContentProps) {
  const api = usePopoverContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  )

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presenceApi().presenceProps.ref, props.ref)}
      />
    </Show>
  )
}
