import type { ThumbProps } from '@destyler/slider'
import { createContext } from '$lib/utils/create-context'

export const [SliderThumbPropsProvider, useSliderThumbPropsContext] = createContext<ThumbProps>({
  name: 'SliderThumbPropsContext',
})
