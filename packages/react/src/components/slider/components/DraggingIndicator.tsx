import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'
import { useSliderThumbPropsContext } from '../hooks/use-slider-thumb-props-context'

export interface SliderDraggingIndicatorBaseProps extends PolymorphicProps {}
export interface SliderDraggingIndicatorProps extends HTMLProps<'span'>, SliderDraggingIndicatorBaseProps {}

export const SliderDraggingIndicator = forwardRef<HTMLSpanElement, SliderDraggingIndicatorProps>((props, ref) => {
  const slider = useSliderContext()
  const { index } = useSliderThumbPropsContext()
  const mergedProps = mergeProps(slider.getDraggingIndicatorProps({ index }), props)

  return (
    <ui.span {...mergedProps} ref={ref}>
      {props.children || slider.getThumbValue(index)}
    </ui.span>
  )
})

SliderDraggingIndicator.displayName = 'SliderDraggingIndicator'
