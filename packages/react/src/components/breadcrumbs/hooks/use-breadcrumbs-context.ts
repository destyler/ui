import type { UseBreadcrumbsReturn } from './use-breadcrumbs'
import { createContext } from '~/utils/create-context'

export type UseBreadcrumbsContext = UseBreadcrumbsReturn

export const [BreadcrumbsProvider, useBreadcrumbsContext] = createContext<UseBreadcrumbsContext>({
  name: 'BreadcrumbsContext',
  hookName: 'useBreadcrumbsContext',
  providerName: '<BreadcrumbsProvider />',
  strict: true,
})
