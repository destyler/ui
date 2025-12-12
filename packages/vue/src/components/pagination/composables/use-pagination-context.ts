import type { UsePaginationReturn } from './use-pagination'
import { createContext } from '~/utils'

export interface UsePaginationContext extends UsePaginationReturn {}

export const [PaginationProvider, usePaginationContext] = createContext<UsePaginationContext>('PaginationContext')
