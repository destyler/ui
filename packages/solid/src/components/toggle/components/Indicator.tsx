import type { JSX } from 'solid-js'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useToggleContext } from '../hooks/use-toggle-context'

export interface ToggleIndicatorBaseProps extends PolymorphicProps<'div'> {
  fallback?: JSX.Element
}

export interface ToggleIndicatorProps extends HTMLProps<'div'>, ToggleIndicatorBaseProps {}

export function ToggleIndicator(props: ToggleIndicatorProps) {
  const [localProps, restProps] = splitProps(props, ['children', 'fallback'])
  const toggle = useToggleContext()
  const mergedProps = mergeProps(() => toggle().getIndicatorProps(), restProps)
  return (
    <ui.div {...mergedProps}>
      <Show when={toggle().pressed} fallback={localProps.fallback}>
        {localProps.children}
      </Show>
    </ui.div>
  )
}
