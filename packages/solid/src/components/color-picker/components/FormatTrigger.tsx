import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerFormatTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ColorPickerFormatTriggerProps
  extends HTMLProps<'button'>,
  ColorPickerFormatTriggerBaseProps {}

export function ColorPickerFormatTrigger(props: ColorPickerFormatTriggerProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getFormatTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
