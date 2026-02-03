import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderValueTextBaseProps extends PolymorphicProps {}
export interface SliderValueTextProps extends HTMLProps<'span'>, SliderValueTextBaseProps {}

export const SliderValueText = forwardRef<HTMLDivElement, SliderValueTextProps>((props, ref) => {
  const { children, ...rest } = props
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getValueTextProps(), rest)

  return (
    <ui.span {...mergedProps} ref={ref}>
      {children || slider.value.join(', ')}
    </ui.span>
  )
})

SliderValueText.displayName = 'SliderValueText'
