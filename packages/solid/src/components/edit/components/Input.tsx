import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditInputBaseProps extends PolymorphicProps<'input'> {}
export interface EditInputProps extends HTMLProps<'input'>, EditInputBaseProps {}

export function EditInput(props: EditInputProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
