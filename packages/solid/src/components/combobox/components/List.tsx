import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxListBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxListProps extends HTMLProps<'div'>, ComboboxListBaseProps {}

export function ComboboxList(props: ComboboxListProps) {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(() => combobox().getListProps(), props)

  return <ui.div {...mergedProps} />
}
