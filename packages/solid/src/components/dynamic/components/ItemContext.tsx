import type { JSX } from 'solid-js'
import type { UseDynamicItemContext } from '../hooks/use-dynamic-item-context'
import {

  useDynamicItemContext,
} from '../hooks/use-dynamic-item-context'

export interface DynamicItemContextProps {
  children: (context: UseDynamicItemContext) => JSX.Element
}

export function DynamicItemContext(props: DynamicItemContextProps) {
  return props.children(useDynamicItemContext())
}
