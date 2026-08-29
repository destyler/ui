import type { Accessor } from '$lib/types'
import type { ItemState } from '@destyler/steps'
import { createContext } from '$lib/utils/create-context'

export interface UseStepsItemContext extends Accessor<ItemState> {}

export const [StepsItemProvider, useStepsItemContext] = createContext<UseStepsItemContext>({
  name: 'StepsItemContext',
  hookName: 'useStepsItemContext',
  providerName: '<StepsItemProvider />',
})
