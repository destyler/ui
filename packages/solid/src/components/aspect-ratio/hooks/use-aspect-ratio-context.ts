import type { UseAspectRatioReturn } from './use-aspect-ratio'
import { createContext } from '~/utils/create-context'

export interface UseAspectRatioContext extends UseAspectRatioReturn {}

const aspectRatioProviderTuple = createContext<UseAspectRatioContext>({
  hookName: 'useAspectRatioContext',
  providerName: '<AspectRatioProvider />',
})

export const AspectRatioProvider = aspectRatioProviderTuple[0]
export const useAspectRatioContext = aspectRatioProviderTuple[1]
