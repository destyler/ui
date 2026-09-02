import type { JSX } from 'solid-js'
import type { UseRadioContext } from '../hooks/use-radio-context'
import { useRadioContext } from '../hooks/use-radio-context'

export interface RadioContextProps {
  children: (context: UseRadioContext) => JSX.Element
}

export function RadioContext(props: RadioContextProps) {
  return props.children(useRadioContext())
}
