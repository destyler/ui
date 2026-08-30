import type { UseSliderReturn } from './use-slider'
import { createContext } from '~/utils/create-context'

export interface UseSliderContext extends UseSliderReturn {}

const sliderProviderTuple = createContext<UseSliderContext>({
  hookName: 'useSliderContext',
  providerName: '<SliderProvider />',
})

export const SliderProvider = sliderProviderTuple[0]
export const useSliderContext = sliderProviderTuple[1]
