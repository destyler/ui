import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderControlBaseProps extends PolymorphicProps {}
export interface SliderControlProps extends HTMLProps<'div'>, SliderControlBaseProps {}

export const SliderControl = forwardRef<HTMLDivElement, SliderControlProps>((props, ref) => {
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SliderControl.displayName = 'SliderControl'
