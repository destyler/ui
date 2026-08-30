import type { UseSliderProps } from '../hooks/use-slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSlider } from '../hooks/use-slider'
import { SliderProvider } from '../hooks/use-slider-context'

export interface SliderRootBaseProps extends UseSliderProps, PolymorphicProps<'div'> {}
export interface SliderRootProps extends Assign<HTMLProps<'div'>, SliderRootBaseProps> {}

export function SliderRoot(props: SliderRootProps) {
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
  const api = useSlider(useSliderProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <SliderProvider value={api}>
      <ui.div {...mergedProps} />
    </SliderProvider>
  )
}
