import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldLabelBaseProps extends PolymorphicProps<'label'> {}
export interface FieldLabelProps extends HTMLProps<'label'>, FieldLabelBaseProps {}

export function FieldLabel(props: FieldLabelProps) {
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field?.().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
