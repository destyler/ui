import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelContentBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelContentProps
  extends HTMLProps<'div'>,
  FloatingPanelContentBaseProps {}

export function FloatingPanelContent(props: FloatingPanelContentProps) {
  const api = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presence().presenceProps,
    props,
  )

  return (
    <Show when={!presence().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presence().presenceProps.ref, props.ref)}
      />
    </Show>
  )
}
