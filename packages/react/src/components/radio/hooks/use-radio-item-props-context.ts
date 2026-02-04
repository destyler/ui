import type { ItemProps } from '@destyler/radio'
import { createContext } from '~/utils/create-context'

export const [RadioItemPropsProvider, useRadioItemPropsContext] = createContext<ItemProps>({
  name: 'RadioItemPropsContext',
  hookName: 'useRadioItemPropsContext',
  providerName: '<RadioItemPropsProvider />',
})
