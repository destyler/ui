import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetHelperTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldsetHelperTextProps extends HTMLProps<'span'>, FieldsetHelperTextBaseProps {}

export function FieldsetHelperText(props: FieldsetHelperTextProps) {
  const fieldset = useFieldsetContext()
  const mergedProps = mergeProps(() => fieldset().getHelperTextProps(), props)

  return <ui.span {...mergedProps} />
}
