import type { JSX } from 'solid-js'
import type { UseSliderContext } from '../hooks/use-slider-context'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderContextProps {
  children: (context: UseSliderContext) => JSX.Element
}

export const SliderContext = (props: SliderContextProps) => props.children(useSliderContext())
