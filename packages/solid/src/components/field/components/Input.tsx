import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldInputBaseProps extends PolymorphicProps<'input'> {}
export interface FieldInputProps extends HTMLProps<'input'>, FieldInputBaseProps {}

export function FieldInput(props: FieldInputProps) {
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field?.().getInputProps(), props)

  return <ui.input {...mergedProps} />
}
