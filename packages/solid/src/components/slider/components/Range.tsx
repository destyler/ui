import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderRangeBaseProps extends PolymorphicProps<'div'> {}
export interface SliderRangeProps extends HTMLProps<'div'>, SliderRangeBaseProps {}

export function SliderRange(props: SliderRangeProps) {
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getRangeProps(), props)

  return <ui.div {...mergedProps} />
}
