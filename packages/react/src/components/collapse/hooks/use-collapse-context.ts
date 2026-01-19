import type { UseCollapseReturn } from './use-collapse'
import { createContext } from '~/utils/create-context'

export interface UseCollapseContext extends UseCollapseReturn {}

export const [CollapseProvider, useCollapseContext] = createContext<UseCollapseContext>({
  name: 'CollapseContext',
  hookName: 'useCollapseContext',
  providerName: '<CollapseProvider />',
})
