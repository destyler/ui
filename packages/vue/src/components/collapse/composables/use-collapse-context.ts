import type { UseCollapseReturn } from './use-collapse'
import type { UsePresenceProps } from '~/components/presence'
import { createContext } from '~/utils'

export interface UseCollapseContext extends UseCollapseReturn, UsePresenceProps {}

export const [CollapseProvider, useCollapseContext] = createContext<UseCollapseContext>('CollapseContext')
