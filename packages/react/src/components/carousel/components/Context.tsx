import type { ReactNode } from 'react'
import type { UseCarouselContext } from '../hooks/use-carousel-context'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselContextProps {
  children: (context: UseCarouselContext) => ReactNode
}

export const CarouselContext = (props: CarouselContextProps) => props.children(useCarouselContext())
