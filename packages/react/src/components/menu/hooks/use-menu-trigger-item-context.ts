import type { UseMenuReturn } from './use-menu'
import { createContext } from '~/utils/create-context'

export type UseMenuTriggerItemContext = () => ReturnType<UseMenuReturn['api']['getTriggerItemProps']> | undefined

export const [MenuTriggerItemProvider, useMenuTriggerItemContext] = createContext<UseMenuTriggerItemContext>({
  name: 'MenuMachineContext',
  hookName: 'useMenuMachineContext',
  providerName: '<MenuMachineProvider />',
  strict: false,
})
