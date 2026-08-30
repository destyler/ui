import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelMinimizeTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelMinimizeTriggerProps
  extends HTMLProps<'button'>,
  FloatingPanelMinimizeTriggerBaseProps {}

export function FloatingPanelMinimizeTrigger(props: FloatingPanelMinimizeTriggerProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getMinimizeTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
