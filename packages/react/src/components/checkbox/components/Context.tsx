import type { ReactNode } from 'react'
import type { UseCheckboxContext } from '../hooks/use-checkbox-context'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxContextProps {
  children: (context: UseCheckboxContext) => ReactNode
}

export const CheckboxContext = (props: CheckboxContextProps) => props.children(useCheckboxContext())
