import type { UseProgressReturn } from './use-progress'
import { createContext } from '~/utils'

export interface UseProgressContext extends UseProgressReturn {}

export const [ProgressProvider, useProgressContext] = createContext<UseProgressContext>('ProgressContext')
