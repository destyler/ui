import type { ReactNode } from 'react'
import { useSeparatorContext } from '../hooks/use-separator-context'

export interface SeparatorContextProps {
  children?: (separator: ReturnType<typeof useSeparatorContext>) => ReactNode
}

export function SeparatorContext(props: SeparatorContextProps) {
  const separator = useSeparatorContext()
  return props.children?.(separator) ?? null
}
