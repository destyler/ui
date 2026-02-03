import type { UseSliderProps } from '../hooks/use-slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSlider } from '../hooks/use-slider'
import { SliderProvider } from '../hooks/use-slider-context'

export interface SliderRootBaseProps extends UseSliderProps, PolymorphicProps {}
export interface SliderRootProps extends Omit<HTMLProps<'div'>, keyof UseSliderProps>, SliderRootBaseProps {}

export const SliderRoot = forwardRef<HTMLDivElement, SliderRootProps>((props, ref) => {
  const [useSliderProps, localProps] = createSplitProps<UseSliderProps>()(props, [
    'aria-label',
    'aria-labelledby',
    'defaultValue',
    'disabled',
    'form',
    'getAriaValueText',
    'id',
    'ids',
    'invalid',
    'max',
    'min',
    'minStepsBetweenThumbs',
    'name',
    'onFocusChange',
    'onValueChange',
    'onValueChangeEnd',
    'orientation',
    'origin',
    'readOnly',
    'step',
    'thumbAlignment',
    'thumbAlignment',
    'thumbSize',
    'value',
  ])
  const slider = useSlider(useSliderProps)
  const mergedProps = mergeProps(slider.getRootProps(), localProps)

  return (
    <SliderProvider value={slider}>
      <ui.div {...mergedProps} ref={ref} />
    </SliderProvider>
  )
})

SliderRoot.displayName = 'SliderRoot'
