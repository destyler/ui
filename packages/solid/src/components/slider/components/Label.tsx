import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderLabelBaseProps extends PolymorphicProps<'label'> {}
export interface SliderLabelProps extends HTMLProps<'label'>, SliderLabelBaseProps {}

export function SliderLabel(props: SliderLabelProps) {
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
