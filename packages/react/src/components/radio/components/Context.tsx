import type { ReactNode } from 'react'
import type { UseRadioContext } from '../hooks/use-radio-context'
import { useRadioContext } from '../hooks/use-radio-context'

export interface RadioContextProps {
  children: (context: UseRadioContext) => ReactNode
}

export const RadioContext = (props: RadioContextProps) => props.children(useRadioContext())
