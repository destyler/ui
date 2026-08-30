import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxInputBaseProps extends PolymorphicProps<'input'> {}
export interface ComboboxInputProps extends HTMLProps<'input'>, ComboboxInputBaseProps {}

export function ComboboxInput(props: ComboboxInputProps) {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(() => combobox().getInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
