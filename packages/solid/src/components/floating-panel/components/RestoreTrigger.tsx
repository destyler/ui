import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelRestoreTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelRestoreTriggerProps
  extends HTMLProps<'button'>,
  FloatingPanelRestoreTriggerBaseProps {}

export function FloatingPanelRestoreTrigger(props: FloatingPanelRestoreTriggerProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getRestoreTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
