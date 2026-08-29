import type { Accessor } from '$lib/types'
import type { OptionItemProps } from '@destyler/menu'
import { createContext } from '$lib/utils/create-context'

export const [MenuItemPropsProvider, useMenuItemPropsContext] = createContext<Accessor<OptionItemProps>>({
  name: 'MenuItemPropsContext',
  hookName: 'useMenuItemPropsContext',
  providerName: '<MenuItemPropsProvider />',
})
