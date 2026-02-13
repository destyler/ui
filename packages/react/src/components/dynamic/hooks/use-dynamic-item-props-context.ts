import type { ItemProps } from '@destyler/dynamic'
import { createContext } from '~/utils/create-context'

export const [DynamicItemPropsProvider, useDynamicItemPropsContext] = createContext<ItemProps>({
  name: 'DynamicItemPropsContext',
  hookName: 'useDynamicItemPropsContext',
  providerName: '<DynamicItemPropsProvider />',
})
