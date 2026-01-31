import type { ReactNode } from 'react'
import type { UseFieldContext } from '../hooks/use-field-context'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldContextProps {
  children: (context: UseFieldContext) => ReactNode
}

export const FieldContext = (props: FieldContextProps) => props.children(useFieldContext())
