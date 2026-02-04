import type { ReactNode } from 'react'
import type { UseRadioItemContext } from '../hooks/use-radio-item-context'
import { useRadioItemContext } from '../hooks/use-radio-item-context'

export interface RadioItemContextProps {
  children: (context: UseRadioItemContext) => ReactNode
}

export const RadioItemContext = (props: RadioItemContextProps) => props.children(useRadioItemContext())
