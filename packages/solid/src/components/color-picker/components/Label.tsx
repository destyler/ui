import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ColorPickerLabelProps extends HTMLProps<'label'>, ColorPickerLabelBaseProps {}

export function ColorPickerLabel(props: ColorPickerLabelProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
