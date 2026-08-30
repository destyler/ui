import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ColorPickerTriggerProps extends HTMLProps<'button'>, ColorPickerTriggerBaseProps {}

export function ColorPickerTrigger(props: ColorPickerTriggerProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
