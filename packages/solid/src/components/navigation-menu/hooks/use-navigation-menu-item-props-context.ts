import type { ItemProps } from '@destyler/navigation-menu'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseNavigationMenuItemPropsContext extends Accessor<ItemProps> {}

const navigationMenuItemPropsProviderTuple = createContext<UseNavigationMenuItemPropsContext>({
  hookName: 'useNavigationMenuItemPropsContext',
  providerName: '<NavigationMenuItemPropsProvider />',
  strict: false,
})

export const NavigationMenuItemPropsProvider = navigationMenuItemPropsProviderTuple[0]
export const useNavigationMenuItemPropsContext = navigationMenuItemPropsProviderTuple[1]
