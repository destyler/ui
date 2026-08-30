import type { JSX } from 'solid-js'
import type { UsePaginationContext } from '../hooks/use-pagination-context'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationContextProps {
  children: (context: UsePaginationContext) => JSX.Element
}

export function PaginationContext(props: PaginationContextProps) {
  return props.children(usePaginationContext())
}
