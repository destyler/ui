import type { UseBreadcrumbsReturn } from './use-breadcrumbs.svelte'
import { createContext } from '$lib/utils/create-context'

export type UseBreadcrumbsContext = UseBreadcrumbsReturn

export const [BreadcrumbsProvider, useBreadcrumbsContext] = createContext<UseBreadcrumbsContext>({
  name: 'BreadcrumbsContext',
  hookName: 'useBreadcrumbsContext',
  providerName: '<BreadcrumbsProvider />',
})
