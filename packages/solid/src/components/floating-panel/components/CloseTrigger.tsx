import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelCloseTriggerProps
  extends HTMLProps<'button'>,
  FloatingPanelCloseTriggerBaseProps {}

export function FloatingPanelCloseTrigger(props: FloatingPanelCloseTriggerProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
