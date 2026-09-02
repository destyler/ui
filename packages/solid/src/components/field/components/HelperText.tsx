import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldHelperTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldHelperTextProps extends HTMLProps<'span'>, FieldHelperTextBaseProps {}

export function FieldHelperText(props: FieldHelperTextProps) {
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field().getHelperTextProps(), props)

  return <ui.span {...mergedProps} />
}
