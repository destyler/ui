import type { ItemProps } from '@destyler/collapse'
import { createContext } from '~/utils/create-context'

export interface UseCollapseItemPropsContext extends ItemProps {}

export const [CollapseItemPropsProvider, useCollapseItemPropsContext] = createContext<ItemProps>({
  name: 'CollapseItemPropsContext',
  hookName: 'useCollapseItemPropsContext',
  providerName: '<CollapseItemPropsProvider />',
})
