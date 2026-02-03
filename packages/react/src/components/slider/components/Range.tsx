import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderRangeBaseProps extends PolymorphicProps {}
export interface SliderRangeProps extends HTMLProps<'div'>, SliderRangeBaseProps {}

export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>((props, ref) => {
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getRangeProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SliderRange.displayName = 'SliderRange'
