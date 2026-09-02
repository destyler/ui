import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelPositionerProps
  extends HTMLProps<'div'>,
  FloatingPanelPositionerBaseProps {}

export function FloatingPanelPositioner(props: FloatingPanelPositionerProps) {
  const api = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(() => api().getPositionerProps(), props)

  return (
    <Show when={!presence().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
