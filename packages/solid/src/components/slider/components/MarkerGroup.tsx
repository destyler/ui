import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderMarkerGroupBaseProps extends PolymorphicProps<'div'> {}
export interface SliderMarkerGroupProps extends HTMLProps<'div'>, SliderMarkerGroupBaseProps {}

export function SliderMarkerGroup(props: SliderMarkerGroupProps) {
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getMarkerGroupProps(), props)

  return <ui.div {...mergedProps} />
}
