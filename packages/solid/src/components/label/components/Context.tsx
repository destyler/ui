import type { JSX } from 'solid-js'
import type { UseLabelContext } from '../hooks/use-label-context'
import { useLabelContext } from '../hooks/use-label-context'

export interface LabelContextProps {
  children: (context: UseLabelContext) => JSX.Element
}

export const LabelContext = (props: LabelContextProps) => props.children(useLabelContext())
