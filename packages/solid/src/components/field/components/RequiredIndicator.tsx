import type { JSX } from 'solid-js'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldRequiredIndicatorBaseProps extends PolymorphicProps<'span'> {
  fallback?: JSX.Element
}
export interface FieldRequiredIndicatorProps
  extends HTMLProps<'span'>,
  FieldRequiredIndicatorBaseProps {}

export function FieldRequiredIndicator(props: FieldRequiredIndicatorProps) {
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field().getRequiredIndicatorProps(), props)

  return (
    <Show when={field().required} fallback={props.fallback}>
      <ui.span {...mergedProps}>{props.children ?? '*'}</ui.span>
    </Show>
  )
}
