import type { ThumbProps } from '@destyler/slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSliderContext } from '../hooks/use-slider-context'
import { SliderThumbPropsProvider } from '../hooks/use-slider-thumb-props-context'

export interface SliderThumbBaseProps extends ThumbProps, PolymorphicProps<'div'> {}
export interface SliderThumbProps extends HTMLProps<'div'>, SliderThumbBaseProps {}

export function SliderThumb(props: SliderThumbProps) {
  const [thumbProps, localProps] = createSplitProps<ThumbProps>()(props, ['index', 'name'])
  const slider = useSliderContext()
  const mergedProps = mergeProps(() => slider().getThumbProps(thumbProps), localProps)

  return (
    <SliderThumbPropsProvider value={thumbProps}>
      <ui.div {...mergedProps} />
    </SliderThumbPropsProvider>
  )
}
