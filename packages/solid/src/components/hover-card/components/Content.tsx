import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useHoverCardContext } from '../hooks/use-hover-card-context'

export interface HoverCardContentBaseProps extends PolymorphicProps<'div'> {}
export interface HoverCardContentProps extends HTMLProps<'div'>, HoverCardContentBaseProps {}

export function HoverCardContent(props: HoverCardContentProps) {
  const api = useHoverCardContext()
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
