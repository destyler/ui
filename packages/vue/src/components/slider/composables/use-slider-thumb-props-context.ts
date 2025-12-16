import type { ThumbProps } from '@destyler/slider'
import { createContext } from '~/utils'

export const [SliderThumbPropsProvider, useSliderThumbPropsContext]
  = createContext<ThumbProps>('SliderThumbPropsContext')
