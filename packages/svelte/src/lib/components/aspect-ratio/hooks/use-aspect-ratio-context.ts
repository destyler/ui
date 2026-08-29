import type { UseAspectRatioReturn } from './use-aspect-ratio.svelte'
import { createContext } from '$lib/utils/create-context'

export type UseAspectRatioContext = UseAspectRatioReturn

export const [AspectRatioProvider, useAspectRatioContext] = createContext<UseAspectRatioContext>({
  name: 'AspectRatioContext',
  hookName: 'useAspectRatioContext',
  providerName: '<AspectRatioProvider />',
})
