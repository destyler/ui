import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface SliderValueTextProps extends HTMLProps<'span'>, SliderValueTextBaseProps {}

export function SliderValueText(props: SliderValueTextProps) {
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getValueTextProps(), props)

  return <ui.span {...mergedProps}>{props.children ?? api().value.join(', ')}</ui.span>
}
