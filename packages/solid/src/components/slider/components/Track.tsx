import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderTrackBaseProps extends PolymorphicProps<'div'> {}
export interface SliderTrackProps extends HTMLProps<'div'>, SliderTrackBaseProps {}

export function SliderTrack(props: SliderTrackProps) {
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getTrackProps(), props)

  return <ui.div {...mergedProps} />
}
