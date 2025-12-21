import type { UseBreadcrumbsReturn } from './use-breadcrumbs'
import { createContext } from '~/utils'

export interface UseBreadcrumbsContext extends UseBreadcrumbsReturn {}

export const [BreadcrumbsProvider, useBreadcrumbsContext] = createContext<UseBreadcrumbsContext>('BreadcrumbsContext')
