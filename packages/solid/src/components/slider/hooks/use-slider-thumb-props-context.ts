import type { ThumbProps } from '@destyler/slider'
import { createContext } from '~/utils/create-context'

const sliderThumbPropsProviderTuple = createContext<ThumbProps>({
  hookName: 'useSliderThumbPropsContext',
  providerName: '<SliderThumbPropsProvider />',
})

export const SliderThumbPropsProvider = sliderThumbPropsProviderTuple[0]
export const useSliderThumbPropsContext = sliderThumbPropsProviderTuple[1]
