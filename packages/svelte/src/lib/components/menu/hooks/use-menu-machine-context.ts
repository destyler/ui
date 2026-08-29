import type { Accessor } from '$lib/types'
import type { Service } from '@destyler/menu'
import { createContext } from '$lib/utils/create-context'

export type UseMenuMachineContext = Accessor<Service>

export const [MenuMachineProvider, useMenuMachineContext] = createContext<UseMenuMachineContext>({
  name: 'MenuMachineContext',
  hookName: 'useMenuMachineContext',
  providerName: '<MenuMachineProvider />',
  strict: false,
})
