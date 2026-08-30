import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelBodyBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelBodyProps extends HTMLProps<'div'>, FloatingPanelBodyBaseProps {}

export function FloatingPanelBody(props: FloatingPanelBodyProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getBodyProps(), props)

  return <ui.div {...mergedProps} />
}
