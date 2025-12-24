import { createContext } from '~/utils/create-context'
import type { UseAspectRatioReturn } from '../types'

export interface UseAspectRatioContext extends UseAspectRatioReturn {}

export const [AspectRatioProvider, useAspectRatioContext] = createContext<UseAspectRatioContext>({
  name: 'AspectRatioContext',
  hookName: 'useAspectRatioContext',
  providerName: '<AspectRatioProvider />',
})
