import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetErrorTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldsetErrorTextProps extends HTMLProps<'span'>, FieldsetErrorTextBaseProps {}

export function FieldsetErrorText(props: FieldsetErrorTextProps) {
  const fieldset = useFieldsetContext()
  const mergedProps = mergeProps(() => fieldset().getErrorTextProps(), props)

  return (
    <Show when={fieldset().invalid}>
      <ui.span {...mergedProps} />
    </Show>
  )
}
