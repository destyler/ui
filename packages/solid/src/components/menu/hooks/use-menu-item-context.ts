import type { OptionItemState } from '@destyler/menu'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { createContext } from '~/utils/create-context'

export interface UseMenuItemContext extends Accessor<Optional<OptionItemState, 'checked'>> {}

const menuItemProviderTuple = createContext<UseMenuItemContext>({
  hookName: 'useMenuItemContext',
  providerName: '<MenuItemProvider />',
})

export const MenuItemProvider = menuItemProviderTuple[0]
export const useMenuItemContext = menuItemProviderTuple[1]
