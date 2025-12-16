import type { UseSliderReturn } from './use-slider'
import { createContext } from '~/utils'

export interface UseSliderContext extends UseSliderReturn {}

export const [SliderProvider, useSliderContext] = createContext<UseSliderContext>('SliderContext')
