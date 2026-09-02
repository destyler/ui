import type { JSX } from 'solid-js'
import type { UseFieldsetContext } from '../hooks/use-fieldset-context'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetContextProps {
  children: (context: UseFieldsetContext) => JSX.Element
}

export const FieldsetContext = (props: FieldsetContextProps) => props.children(useFieldsetContext())
