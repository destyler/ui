import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface FloatingPanelTitleProps extends HTMLProps<'h2'>, FloatingPanelTitleBaseProps {}

export function FloatingPanelTitle(props: FloatingPanelTitleProps) {
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getTitleProps(), props)

  return <ui.h2 {...mergedProps} />
}
