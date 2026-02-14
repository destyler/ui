import type { ReactNode } from 'react'
import type { UseLabelContext } from '../hooks/use-label-context'
import { useLabelContext } from '../hooks/use-label-context'

export interface LabelContextProps {
  children: (context: UseLabelContext) => ReactNode
}

export const LabelContext = (props: LabelContextProps) => props.children(useLabelContext())
