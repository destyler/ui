import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ColorPickerValueTextProps
  extends HTMLProps<'span'>,
  ColorPickerValueTextBaseProps {}

export function ColorPickerValueText(props: ColorPickerValueTextProps) {
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(() => colorPicker().getValueTextProps(), props)

  return <ui.span {...mergedProps}>{props.children ?? colorPicker().valueAsString}</ui.span>
}
