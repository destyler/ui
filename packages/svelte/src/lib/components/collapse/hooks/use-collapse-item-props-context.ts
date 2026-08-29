import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/collapse'
import { createContext } from '../../../utils/create-context'

export interface UseCollapseItemPropsContext extends Accessor<ItemProps> {}

export const [CollapseItemPropsProvider, useCollapseItemPropsContext] = createContext<UseCollapseItemPropsContext>({
  name: 'CollapseItemPropsContext',
  hookName: 'useCollapseItemPropsContext',
  providerName: '<CollapseItemPropsProvider />',
})
