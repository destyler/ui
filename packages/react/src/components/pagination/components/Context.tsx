import type { ReactNode } from 'react'
import type { UsePaginationContext } from '../hooks/use-pagination-context'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationContextProps {
  children: (context: UsePaginationContext) => ReactNode
}

export const PaginationContext = (props: PaginationContextProps) => props.children(usePaginationContext())
