import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerSwatchGroupBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerSwatchGroupProps
  extends HTMLProps<'div'>,
  ColorPickerSwatchGroupBaseProps {}

export function ColorPickerSwatchGroup(props: ColorPickerSwatchGroupProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getSwatchGroupProps(), props)

  return <ui.div {...mergedProps} />
}
