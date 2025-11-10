import type { ComputedRef } from 'vue'
import { createContext } from '../../utils'
import type { UseEnvironmentContext } from './type'


export const [EnvironmentContextProvider, useEnvironmentContext] =
  createContext<ComputedRef<UseEnvironmentContext> | null>('EnvironmentContext')
