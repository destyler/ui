import type { ItemProps } from '@destyler/steps'
import { createContext } from '~/utils/create-context'

export interface UseStepsItemPropsContext extends ItemProps {}

const stepsItemPropsProviderTuple = createContext<UseStepsItemPropsContext>({
  hookName: 'useStepsItemPropsContext',
  providerName: '<StepsItemPropsProvider />',
})

export const StepsItemPropsProvider = stepsItemPropsProviderTuple[0]
export const useStepsItemPropsContext = stepsItemPropsProviderTuple[1]
