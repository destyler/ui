import type { JSX } from 'solid-js'
import type { UseEditContext } from '../hooks/use-edit-context'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditContextProps {
  children: (context: UseEditContext) => JSX.Element
}

export const EditContext = (props: EditContextProps) => props.children(useEditContext())
