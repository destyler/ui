import type { UseCollapsibleProps } from '../hooks/use-collapsible'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCollapsible } from '../hooks/use-collapsible'
import { CollapsibleProvider } from '../hooks/use-collapsible-context'

export interface CollapsibleRootBaseProps extends UseCollapsibleProps, PolymorphicProps<'div'> {}
export interface CollapsibleRootProps extends HTMLProps<'div'>, CollapsibleRootBaseProps {}

export function CollapsibleRoot(props: CollapsibleRootProps) {
  const [useCollapsibleProps, localProps] = createSplitProps<UseCollapsibleProps>()(props, [
    'defaultOpen',
    'disabled',
    'id',
    'ids',
    'lazyMount',
    'onExitComplete',
    'onOpenChange',
    'open',
    'unmountOnExit',
  ])

  const api = useCollapsible(useCollapsibleProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <CollapsibleProvider value={api}>
      <ui.div {...mergedProps} />
    </CollapsibleProvider>
  )
}
