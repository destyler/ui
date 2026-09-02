import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerEyeDropperTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ColorPickerEyeDropperTriggerProps
  extends HTMLProps<'button'>,
  ColorPickerEyeDropperTriggerBaseProps {}

export function ColorPickerEyeDropperTrigger(props: ColorPickerEyeDropperTriggerProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getEyeDropperTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
