import type { MarkerProps } from '@destyler/slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderMarkerBaseProps extends MarkerProps, PolymorphicProps<'span'> {}
export interface SliderMarkerProps extends HTMLProps<'span'>, SliderMarkerBaseProps {}

export function SliderMarker(props: SliderMarkerProps) {
  const [markerProps, localProps] = createSplitProps<MarkerProps>()(props, ['value'])
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getMarkerProps(markerProps), localProps)

  return <ui.span {...mergedProps} />
}
