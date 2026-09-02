import type { JSX } from 'solid-js'
import type { UseCheckboxContext } from '../hooks/use-checkbox-context'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxContextProps {
  children: (context: UseCheckboxContext) => JSX.Element
}

export const CheckboxContext = (props: CheckboxContextProps) => props.children(useCheckboxContext())
