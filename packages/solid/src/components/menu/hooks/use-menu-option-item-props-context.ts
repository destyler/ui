import type { OptionItemProps } from '@destyler/menu'
import { createContext } from '~/utils/create-context'

const menuOptionItemPropsProviderTuple = createContext<OptionItemProps>({
  hookName: 'useMenuOptionItemPropsContext',
  providerName: '<MenuOptionItemPropsProvider />',
})

export const MenuOptionItemPropsProvider = menuOptionItemPropsProviderTuple[0]
export const useMenuOptionItemPropsContext = menuOptionItemPropsProviderTuple[1]
