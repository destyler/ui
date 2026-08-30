import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelHeaderBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelHeaderProps
  extends HTMLProps<'div'>,
  FloatingPanelHeaderBaseProps {}

export function FloatingPanelHeader(props: FloatingPanelHeaderProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getHeaderProps(), props)

  return <ui.div {...mergedProps} />
}
