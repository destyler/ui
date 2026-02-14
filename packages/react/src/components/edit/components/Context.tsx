import type { ReactNode } from 'react'
import type { UseEditContext } from '../hooks/use-edit-context'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditContextProps {
  children: (context: UseEditContext) => ReactNode
}

export const EditContext = (props: EditContextProps) => props.children(useEditContext())
