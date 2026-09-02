import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldSelectBaseProps extends PolymorphicProps<'select'> {}
export interface FieldSelectProps extends HTMLProps<'select'>, FieldSelectBaseProps {}

export function FieldSelect(props: FieldSelectProps) {
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field?.().getSelectProps(), props)

  return <ui.select {...mergedProps} />
}
