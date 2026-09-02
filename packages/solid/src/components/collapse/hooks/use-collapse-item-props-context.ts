import type { ItemProps } from '@destyler/collapse'
import { createContext } from '~/utils/create-context'

const collapseItemPropsProviderTuple = createContext<ItemProps>({
  hookName: 'useCollapseItemPropsContext',
  providerName: '<CollapseItemPropsProvider />',
})

export const CollapseItemPropsProvider = collapseItemPropsProviderTuple[0]
export const useCollapseItemPropsContext = collapseItemPropsProviderTuple[1]
