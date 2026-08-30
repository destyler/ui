import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelMaximizeTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelMaximizeTriggerProps
  extends HTMLProps<'button'>,
  FloatingPanelMaximizeTriggerBaseProps {}

export function FloatingPanelMaximizeTrigger(props: FloatingPanelMaximizeTriggerProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getMaximizeTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
