import type { UseCarouselReturn } from './use-carousel'
import { createContext } from '~/utils/create-context'

export interface UseCarouselContext extends UseCarouselReturn {}

const carouselProviderTuple = createContext<UseCarouselContext>({
  hookName: 'useCarouselContext',
  providerName: '<CarouselProvider />',
})

export const CarouselProvider = carouselProviderTuple[0]
export const useCarouselContext = carouselProviderTuple[1]
