import type { UsePaginationReturn } from './use-pagination'
import { createContext } from '~/utils/create-context'

export interface UsePaginationContext extends UsePaginationReturn {}

const paginationProviderTuple = createContext<UsePaginationContext>({
  hookName: 'usePaginationContext',
  providerName: '<PaginationProvider />',
})

export const PaginationProvider = paginationProviderTuple[0]
export const usePaginationContext = paginationProviderTuple[1]
