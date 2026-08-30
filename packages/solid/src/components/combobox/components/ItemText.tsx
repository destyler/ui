import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { useComboboxItemPropsContext } from '../hooks/use-combobox-item-props-context'

export interface ComboboxItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface ComboboxItemTextProps extends HTMLProps<'span'>, ComboboxItemTextBaseProps {}

export function ComboboxItemText(props: ComboboxItemTextProps) {
  const api = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const mergedProps = mergeProps(() => api().getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} />
}
