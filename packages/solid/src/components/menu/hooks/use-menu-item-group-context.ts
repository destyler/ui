import { createContext } from '~/utils/create-context'

export interface ValueChangeDetails {
  value: string
}

export interface UseMenuItemGroupContext {
  id: string
  value?: string
  onValueChange?: (e: ValueChangeDetails) => void
}

const menuItemGroupProviderTuple = createContext<UseMenuItemGroupContext>({
  hookName: 'useMenuItemGroupContext',
  providerName: '<MenuItemGroupProvider />',
})

export const MenuItemGroupProvider = menuItemGroupProviderTuple[0]
export const useMenuItemGroupContext = menuItemGroupProviderTuple[1]
