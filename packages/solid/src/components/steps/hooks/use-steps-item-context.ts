import type { ItemState } from '@destyler/steps'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseStepsItemContext extends Accessor<ItemState> {}

const stepsItemProviderTuple = createContext<UseStepsItemContext>({
  hookName: 'useStepsItemContext',
  providerName: '<StepsItem />',
})

export const StepsItemProvider = stepsItemProviderTuple[0]
export const useStepsItemContext = stepsItemProviderTuple[1]
