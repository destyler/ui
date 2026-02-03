import type { UseSliderReturn } from './use-slider'
import { createContext } from '~/utils/create-context'

export interface UseSliderContext extends UseSliderReturn {}

export const [SliderProvider, useSliderContext] = createContext<UseSliderContext>({
  name: 'SliderContext',
  hookName: 'useSliderContext',
  providerName: '<SliderProvider />',
})
