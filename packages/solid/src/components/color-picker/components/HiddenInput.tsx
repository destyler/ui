import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface ColorPickerHiddenInputProps
  extends HTMLProps<'input'>,
  ColorPickerHiddenInputBaseProps {}

export function ColorPickerHiddenInput(props: ColorPickerHiddenInputProps) {
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(() => colorPicker().getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
