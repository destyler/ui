import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSliderContext } from '../hooks/use-slider-context'
import { useSliderThumbPropsContext } from '../hooks/use-slider-thumb-props-context'

export interface SliderHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface SliderHiddenInputProps extends HTMLProps<'input'>, SliderHiddenInputBaseProps {}

export function SliderHiddenInput(props: SliderHiddenInputProps) {
  const slider = useSliderContext()
  const thumbProps = useSliderThumbPropsContext()
  const mergedProps = mergeProps(() => slider().getHiddenInputProps(thumbProps), props)

  return <ui.input {...mergedProps} />
}
