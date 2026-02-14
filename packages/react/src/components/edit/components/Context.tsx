import type { ReactNode } from 'react'
import { type UseEditContext, useEditContext } from '../hooks/use-edit-context'

export interface EditContextProps {
  children: (context: UseEditContext) => ReactNode
}

export const EditContext = (props: EditContextProps) => props.children(useEditContext())
