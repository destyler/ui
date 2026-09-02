import type { JSX } from 'solid-js'
import type { UseFloatingPanelContext } from '../hooks/use-floating-panel-context'
import {

  useFloatingPanelContext,
} from '../hooks/use-floating-panel-context'

export interface FloatingPanelContextProps {
  children: (context: UseFloatingPanelContext) => JSX.Element
}

export function FloatingPanelContext(props: FloatingPanelContextProps) {
  return props.children(useFloatingPanelContext())
}
