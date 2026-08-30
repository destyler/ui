import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelDragTriggerBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelDragTriggerProps
  extends HTMLProps<'div'>,
  FloatingPanelDragTriggerBaseProps {}

export function FloatingPanelDragTrigger(props: FloatingPanelDragTriggerProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getDragTriggerProps(), props)

  return <ui.div {...mergedProps} />
}
