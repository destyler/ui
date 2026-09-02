import type { JSX } from 'solid-js'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { children, Show } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useClipboardContext } from '../hooks/use-clipboard-context'

interface IndicatorProps {
  copied?: JSX.Element
}

export interface ClipboardIndicatorBaseProps extends IndicatorProps, PolymorphicProps<'div'> {}
export interface ClipboardIndicatorProps extends HTMLProps<'div'>, ClipboardIndicatorBaseProps {}

export function ClipboardIndicator(props: ClipboardIndicatorProps) {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, ['copied'])
  const api = useClipboardContext()
  const mergedProps = mergeProps(api().getIndicatorProps({ copied: api().copied }), localProps)
  const getChildren = children(() => localProps.children)

  return (
    <ui.div {...mergedProps}>
      <Show when={api().copied} fallback={getChildren()}>
        {indicatorProps.copied}
      </Show>
    </ui.div>
  )
}
