import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/steps'
import { createContext } from '$lib/utils/create-context'

export interface UseStepsItemPropsContext extends Accessor<ItemProps> {}

export const [StepsItemPropsProvider, useStepsItemPropsContext] = createContext<UseStepsItemPropsContext>({
  name: 'StepsItemPropsContext',
  hookName: 'useStepsItemPropsContext',
  providerName: '<StepsItemPropsProvider />',
})
