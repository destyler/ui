import type { ReactNode } from 'react'
import type { UseFieldsetContext } from '../hooks/use-fieldset-context'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetContextProps {
  children: (context: UseFieldsetContext) => ReactNode
}

export const FieldsetContext = (props: FieldsetContextProps) => props.children(useFieldsetContext())
