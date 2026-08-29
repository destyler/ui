import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/navigation-menu'
import { createContext } from '$lib/utils/create-context'

export interface UseNavigationMenuItemPropsContext extends Accessor<ItemProps> {}

export const [NavigationMenuItemPropsProvider, useNavigationMenuItemPropsContext]
  = createContext<UseNavigationMenuItemPropsContext>({
    name: 'NavigationMenuItemPropsContext',
    strict: false,
  })
