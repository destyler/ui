import type { UseCollapseReturn } from './use-collapse'
import { createContext } from '~/utils/create-context'

export interface UseCollapseContext extends UseCollapseReturn {}

const collapseProviderTuple = createContext<UseCollapseContext>({
  hookName: 'useCollapseContext',
  providerName: '<CollapseProvider />',
})

export const CollapseProvider = collapseProviderTuple[0]
export const useCollapseContext = collapseProviderTuple[1]
