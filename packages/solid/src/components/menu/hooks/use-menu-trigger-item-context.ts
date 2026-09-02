import type { Api } from '@destyler/menu'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export type UseMenuTriggerItemContext = Accessor<ReturnType<Api['getTriggerItemProps']> | undefined>

const menuTriggerItemProviderTuple = createContext<UseMenuTriggerItemContext>({
  hookName: 'useMenuMachineContext',
  providerName: '<MenuMachineProvider />',
  strict: false,
})

export const MenuTriggerItemProvider = menuTriggerItemProviderTuple[0]
export const useMenuTriggerItemContext = menuTriggerItemProviderTuple[1]
