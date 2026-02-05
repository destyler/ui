import type { ItemProps } from '@destyler/select'
import { createContext } from '~/utils/create-context'

export const [SelectItemPropsProvider, useSelectItemPropsContext] = createContext<ItemProps>({
  name: 'SelectItemPropsContext',
  hookName: 'useSelectItemPropsContext',
  providerName: '<SelectItemPropsProvider />',
})
