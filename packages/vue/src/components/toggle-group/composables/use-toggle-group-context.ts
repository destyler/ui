import type { UseToggleGroupReturn } from './use-toggle-group'
import { createContext } from '~/utils'

export interface UseToggleGroupContext extends UseToggleGroupReturn {}

export const [ToggleGroupProvider, useToggleGroupContext] = createContext<UseToggleGroupContext>('ToggleGroupContext')
