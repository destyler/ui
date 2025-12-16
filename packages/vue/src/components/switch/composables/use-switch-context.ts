import type { UseSwitchReturn } from './use-switch'
import { createContext } from '~/utils'

export interface UseSwitchContext extends UseSwitchReturn {}

export const [SwitchProvider, useSwitchContext] = createContext<UseSwitchContext>('SwitchContext')
