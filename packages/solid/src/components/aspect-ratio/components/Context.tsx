import type { JSX } from 'solid-js'
import type { UseAspectRatioContext } from '../hooks/use-aspect-ratio-context'
import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

export interface AspectRatioContextProps {
  children: (context: UseAspectRatioContext) => JSX.Element
}

export function AspectRatioContext(props: AspectRatioContextProps) {
  return props.children(useAspectRatioContext())
}
