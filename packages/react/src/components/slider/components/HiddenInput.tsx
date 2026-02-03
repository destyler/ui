import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'
import { useSliderThumbPropsContext } from '../hooks/use-slider-thumb-props-context'

export interface SliderHiddenInputBaseProps extends PolymorphicProps {}
export interface SliderHiddenInputProps extends HTMLProps<'input'>, SliderHiddenInputBaseProps {}

export const SliderHiddenInput = forwardRef<HTMLInputElement, SliderHiddenInputProps>((props, ref) => {
  const slider = useSliderContext()
  const thumbProps = useSliderThumbPropsContext()
  const mergedProps = mergeProps(slider.getHiddenInputProps(thumbProps), props)

  return <ui.input {...mergedProps} ref={ref} />
})

SliderHiddenInput.displayName = 'SliderHiddenInput'
