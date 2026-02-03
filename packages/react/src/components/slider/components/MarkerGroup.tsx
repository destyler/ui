import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderMarkerGroupBaseProps extends PolymorphicProps {}
export interface SliderMarkerGroupProps extends HTMLProps<'div'>, SliderMarkerGroupBaseProps {}

export const SliderMarkerGroup = forwardRef<HTMLDivElement, SliderMarkerGroupProps>((props, ref) => {
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getMarkerGroupProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SliderMarkerGroup.displayName = 'SliderMarkerGroup'
