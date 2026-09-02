import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { orFallback } from '~/utils/or-fallback'
import { useSliderContext } from '../hooks/use-slider-context'
import { useSliderThumbPropsContext } from '../hooks/use-slider-thumb-props-context'

export interface SliderDraggingIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface SliderDraggingIndicatorProps
  extends HTMLProps<'span'>,
  SliderDraggingIndicatorBaseProps {}

export function SliderDraggingIndicator(props: SliderDraggingIndicatorProps) {
  const slider = useSliderContext()
  const thumbProps = useSliderThumbPropsContext()
  const mergedProps = mergeProps(() => slider().getDraggingIndicatorProps(thumbProps), props)

  return (
    <ui.span {...mergedProps}>
      {orFallback(props.children, slider().getThumbValue(thumbProps.index))}
    </ui.span>
  )
}
