import type { UsePaginationReturn } from './use-pagination'
import { createContext } from '~/utils/create-context'

export interface UsePaginationContext extends UsePaginationReturn {}

export const [PaginationProvider, usePaginationContext] = createContext<UsePaginationContext>({
  name: 'PaginationContext',
  hookName: 'usePaginationContext',
  providerName: '<PaginationProvider />',
})
