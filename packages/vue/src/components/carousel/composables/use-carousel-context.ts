import type { UseCarouselReturn } from './use-carousel'
import { createContext } from '~/utils'

export interface UseCarouselContext extends UseCarouselReturn {}

export const [CarouselProvider, useCarouselContext] = createContext<UseCarouselContext>('CarouselContext')
