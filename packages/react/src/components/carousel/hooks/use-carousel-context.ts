import type { UseCarouselReturn } from './use-carousel'
import { createContext } from '~/utils/create-context'

export interface UseCarouselContext extends UseCarouselReturn {}

export const [CarouselProvider, useCarouselContext] = createContext<UseCarouselContext>({
  name: 'CarouselContext',
  hookName: 'useCarouselContext',
  providerName: '<CarouselProvider />',
})
