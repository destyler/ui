import type { HTMLProps, PolymorphicProps } from '~/factory'
import { ui } from '~/factory'

export interface FloatingPanelDockBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelDockProps extends HTMLProps<'div'>, FloatingPanelDockBaseProps {}

export function FloatingPanelDock(props: FloatingPanelDockProps) {
  return <ui.div data-scope="floating-panel" data-part="dock" {...props} />
}
