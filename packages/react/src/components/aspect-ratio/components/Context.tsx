import type { ReactNode } from 'react'
import type { UseAspectRatioContext } from '../hooks/use-aspect-ratio-context'
import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

export interface AspectRatioContextProps {
  children: (context: UseAspectRatioContext) => ReactNode
}

export const AspectRatioContext = (props: AspectRatioContextProps) => props.children(useAspectRatioContext())
