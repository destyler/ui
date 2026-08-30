import type { UseMenuReturn } from './use-menu'
import { createContext } from '~/utils/create-context'

export type UseMenuContext = UseMenuReturn['api']

const menuProviderTuple = createContext<UseMenuContext>({
  hookName: 'useMenuContext',
  providerName: '<MenuProvider />',
  strict: false,
})

export const MenuProvider = menuProviderTuple[0]
export const useMenuContext = menuProviderTuple[1]
