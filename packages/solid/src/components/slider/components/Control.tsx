import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'

export interface SliderControlBaseProps extends PolymorphicProps<'div'> {}
export interface SliderControlProps extends HTMLProps<'div'>, SliderControlBaseProps {}

export function SliderControl(props: SliderControlProps) {
  const api = useSliderContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
