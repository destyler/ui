import type { UseSwitchReturn } from './use-switch'
import { createContext } from '~/utils/create-context'

export interface UseSwitchContext extends UseSwitchReturn {}

const switchProviderTuple = createContext<UseSwitchContext>({
  hookName: 'useSwitchContext',
  providerName: '<SwitchProvider />',
})

export const SwitchProvider = switchProviderTuple[0]
export const useSwitchContext = switchProviderTuple[1]
