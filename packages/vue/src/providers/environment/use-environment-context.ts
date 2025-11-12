import type { ComputedRef } from 'vue'
import type { UseEnvironmentContext } from './type'
import { createContext } from '../../utils'

export const [EnvironmentContextProvider, useEnvironmentContext]
  = createContext<ComputedRef<UseEnvironmentContext> | null>('EnvironmentContext')
