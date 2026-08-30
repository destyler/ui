import type { JSX } from 'solid-js'
import type { UseFieldContext } from '../hooks/use-field-context'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldContextProps {
  children: (context: UseFieldContext) => JSX.Element
}

export const FieldContext = (props: FieldContextProps) => props.children(useFieldContext())
