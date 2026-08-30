import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxControlBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxControlProps extends HTMLProps<'div'>, ComboboxControlBaseProps {}

export function ComboboxControl(props: ComboboxControlProps) {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(() => combobox().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
