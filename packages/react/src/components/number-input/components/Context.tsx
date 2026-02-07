import type { ReactNode } from 'react'
import type { UseNumberInputContext } from '../hooks/use-number-input-context'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputContextProps {
  children: (context: UseNumberInputContext) => ReactNode
}

export const NumberInputContext = (props: NumberInputContextProps) => props.children(useNumberInputContext())
