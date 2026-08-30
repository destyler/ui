import type { JSX } from 'solid-js'
import type { UseSeparatorContext } from '../hooks/use-separator-context'
import { useSeparatorContext } from '../hooks/use-separator-context'

export interface SeparatorContextProps {
  children?: (context: UseSeparatorContext) => JSX.Element
}

export function SeparatorContext(props: SeparatorContextProps) {
  const separator = useSeparatorContext()
  return props.children?.(separator)
}
