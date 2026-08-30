import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerControlBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerControlProps extends HTMLProps<'div'>, ColorPickerControlBaseProps {}

export function ColorPickerControl(props: ColorPickerControlProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
