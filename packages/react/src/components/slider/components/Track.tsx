import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderTrackBaseProps extends PolymorphicProps {}
export interface SliderTrackProps extends HTMLProps<'div'>, SliderTrackBaseProps {}

export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>((props, ref) => {
  const slider = useSliderContext()
  const mergedProps = mergeProps(slider.getTrackProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SliderTrack.displayName = 'SliderTrack'
