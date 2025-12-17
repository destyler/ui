import type { UseToggleReturn } from './use-toggle'
import { createContext } from '~/utils'

export interface UseToggleContext extends UseToggleReturn {}

export const [ToggleProvider, useToggleContext] = createContext<UseToggleContext>('ToggleContext')
