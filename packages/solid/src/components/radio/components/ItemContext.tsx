import type { JSX } from 'solid-js'
import type { UseRadioItemContext } from '../hooks/use-radio-item-context'
import {

  useRadioItemContext,
} from '../hooks/use-radio-item-context'

export interface RadioItemContextProps {
  children: (context: UseRadioItemContext) => JSX.Element
}

export function RadioItemContext(props: RadioItemContextProps) {
  return props.children(useRadioItemContext())
}
