import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface CheckboxHiddenInputProps
  extends HTMLProps<'input'>,
  CheckboxHiddenInputBaseProps {}

export function CheckboxHiddenInput(props: CheckboxHiddenInputProps) {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(() => checkbox().getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
