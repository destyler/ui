import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { useCollapsibleContext } from '../hooks/use-collapsible-context'

export interface CollapsibleContentBaseProps extends PolymorphicProps<'div'> {}
export interface CollapsibleContentProps extends HTMLProps<'div'>, CollapsibleContentBaseProps {}

export function CollapsibleContent(props: CollapsibleContentProps) {
  const api = useCollapsibleContext()
  const mergedProps = mergeProps(() => api().getContentProps(), props)

  return (
    <Show when={!api().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
