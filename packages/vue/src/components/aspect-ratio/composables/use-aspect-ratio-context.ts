import type { UseAspectRatioReturn } from './use-aspect-ratio'
import { createContext } from '~/utils'

export interface UseAspectRatioContext extends UseAspectRatioReturn {}

export const [AspectRatioProvider, useAspectRatioContext] = createContext<UseAspectRatioContext>('AspectRatioContext')
