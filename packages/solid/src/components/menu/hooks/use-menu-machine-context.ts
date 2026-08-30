import type { Accessor } from 'solid-js'
import type { UseMenuReturn } from './use-menu'
import { createContext } from '~/utils/create-context'

export type UseMenuMachineContext = Accessor<UseMenuReturn['machine']> | undefined

const menuMachineProviderTuple = createContext<UseMenuMachineContext>({
  hookName: 'useMenuMachineContext',
  providerName: '<MenuMachineProvider />',
  strict: false,
})

export const MenuMachineProvider = menuMachineProviderTuple[0]
export const useMenuMachineContext = menuMachineProviderTuple[1]
