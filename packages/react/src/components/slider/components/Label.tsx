import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderLabelBaseProps extends PolymorphicProps {}
export interface SliderLabelProps extends HTMLProps<'label'>, SliderLabelBaseProps {}

export const SliderLabel = forwardRef<HTMLLabelElement, SliderLabelProps>((props, ref) => {
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

SliderLabel.displayName = 'SliderLabel'
