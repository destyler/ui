import type { JSX } from 'solid-js'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldRequiredIndicatorBaseProps extends PolymorphicProps<'span'> {
  fallback?: JSX.Element
}
export interface FieldRequiredIndicatorProps
  extends HTMLProps<'span'>,
  FieldRequiredIndicatorBaseProps {}

export function FieldRequiredIndicator(props: FieldRequiredIndicatorProps) {
  const [localProps, restProps] = splitProps(props, ['children', 'fallback'])
  const field = useFieldContext()
  const mergedProps = mergeProps(() => field().getRequiredIndicatorProps(), restProps)

  return (
    <Show when={field().required} fallback={localProps.fallback}>
      <ui.span {...mergedProps}>{localProps.children ?? '*'}</ui.span>
    </Show>
  )
}
