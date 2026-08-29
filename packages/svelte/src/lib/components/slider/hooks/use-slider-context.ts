import type { UseSliderReturn } from './use-slider.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseSliderContext extends UseSliderReturn {}
export const [SliderProvider, useSliderContext] = createContext<UseSliderContext>({
  name: 'SliderContext',
})
