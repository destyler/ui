import type { UseAspectRatioReturn } from './use-aspect-ratio'
import { createContext } from '~/utils/create-context'

export interface UseAspectRatioContext extends UseAspectRatioReturn {}

export const [AspectRatioProvider, useAspectRatioContext] = createContext<UseAspectRatioContext>({
  name: 'AspectRatioContext',
  hookName: 'useAspectRatioContext',
  providerName: '<AspectRatioProvider />',
})
