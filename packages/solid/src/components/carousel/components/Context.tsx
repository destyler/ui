import type { JSX } from 'solid-js'
import type { UseCarouselContext } from '../hooks/use-carousel-context'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselContextProps {
  children: (context: UseCarouselContext) => JSX.Element
}

export const CarouselContext = (props: CarouselContextProps) => props.children(useCarouselContext())
