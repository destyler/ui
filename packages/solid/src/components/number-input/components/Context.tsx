import type { JSX } from 'solid-js'
import type { UseNumberInputContext } from '../hooks/use-number-input-context'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputContextProps {
  children: (context: UseNumberInputContext) => JSX.Element
}

export function NumberInputContext(props: NumberInputContextProps) {
  return props.children(useNumberInputContext())
}
