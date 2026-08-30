import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ComboboxClearTriggerProps
  extends HTMLProps<'button'>,
  ComboboxClearTriggerBaseProps {}

export function ComboboxClearTrigger(props: ComboboxClearTriggerProps) {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(() => combobox().getClearTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
