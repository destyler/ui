import type { ItemProps } from '@destyler/steps'
import { createContext } from '~/utils'

export interface UseStepsItemPropsContext extends ItemProps {}

export const [StepsItemPropsProvider, useStepsItemPropsContext]
  = createContext<UseStepsItemPropsContext>('StepsItemPropsContext')
