import type { Accessor, Optional } from '$lib/types'
import type { OptionItemState } from '@destyler/menu'
import { createContext } from '$lib/utils/create-context'

export interface UseMenuItemContext extends Accessor<Optional<OptionItemState, 'checked'>> {}

export const [MenuItemProvider, useMenuItemContext] = createContext<UseMenuItemContext>({
  name: 'MenuItemContext',
  hookName: 'useMenuItemContext',
  providerName: '<MenuItemProvider />',
})
