import type { UseBreadcrumbsReturn } from './use-breadcrumbs'
import { createContext } from '~/utils/create-context'

export interface UseBreadcrumbsContext extends UseBreadcrumbsReturn {}

const breadcrumbsProviderTuple = createContext<UseBreadcrumbsContext>({
  hookName: 'useBreadcrumbsContext',
  providerName: '<BreadcrumbsProvider />',
})

export const BreadcrumbsProvider = breadcrumbsProviderTuple[0]
export const useBreadcrumbsContext = breadcrumbsProviderTuple[1]
