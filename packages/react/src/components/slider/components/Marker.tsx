import type { MarkerProps } from '@destyler/slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderMarkerBaseProps extends MarkerProps, PolymorphicProps {}
export interface SliderMarkerProps extends HTMLProps<'span'>, SliderMarkerBaseProps {}

export const SliderMarker = forwardRef<HTMLSpanElement, SliderMarkerProps>((props, ref) => {
  const [markerProps, localProps] = createSplitProps<MarkerProps>()(props, ['value'])
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getMarkerProps(markerProps), localProps)

  return <ui.span {...mergedProps} ref={ref} />
})

SliderMarker.displayName = 'SliderMarker'
