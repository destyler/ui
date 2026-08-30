import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ComboboxLabelProps extends HTMLProps<'label'>, ComboboxLabelBaseProps {}

export function ComboboxLabel(props: ComboboxLabelProps) {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(() => combobox().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
