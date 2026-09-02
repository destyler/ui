import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldErrorTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldErrorTextProps extends HTMLProps<'span'>, FieldErrorTextBaseProps {}

export function FieldErrorText(props: FieldErrorTextProps) {
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field().getErrorTextProps(), props)

  return (
    <Show when={field?.().invalid}>
      <ui.span {...mergedProps} />
    </Show>
  )
}
