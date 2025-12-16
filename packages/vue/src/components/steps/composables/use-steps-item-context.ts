import type { ItemState } from '@destyler/steps'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseStepsItemContext extends ComputedRef<ItemState> {}

export const [StepsItemProvider, useStepsItemContext] = createContext<UseStepsItemContext>('StepsItemContext')
