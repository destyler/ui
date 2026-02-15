import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'

export interface FloatingPanelDockBaseProps extends PolymorphicProps {}
export interface FloatingPanelDockProps extends HTMLProps<'div'>, FloatingPanelDockBaseProps {}

export const FloatingPanelDock = forwardRef<HTMLDivElement, FloatingPanelDockProps>((props, ref) => {
  return <ui.div data-scope="floating-panel" data-part="dock" {...props} ref={ref} />
})

FloatingPanelDock.displayName = 'FloatingPanelDock'
