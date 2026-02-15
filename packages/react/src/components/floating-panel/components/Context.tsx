import type { ReactNode } from 'react'
import type { UseFloatingPanelContext } from '../hooks/use-floating-panel-context'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelContextProps {
  children: (floatingPanel: UseFloatingPanelContext) => ReactNode
}

export function FloatingPanelContext(props: FloatingPanelContextProps) {
  const floatingPanel = useFloatingPanelContext()
  return props.children(floatingPanel)
}
