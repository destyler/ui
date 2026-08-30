import type { JSX } from 'solid-js'
import type { UseDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicContextProps {
  children: (context: UseDynamicContext) => JSX.Element
}

export function DynamicContext(props: DynamicContextProps) {
  return props.children(useDynamicContext())
}
