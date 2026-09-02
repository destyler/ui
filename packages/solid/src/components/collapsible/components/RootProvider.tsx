import type { UseCollapsibleReturn } from '../hooks/use-collapsible'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CollapsibleProvider } from '../hooks/use-collapsible-context'

interface RootProviderProps {
  value: UseCollapsibleReturn
}

export interface CollapsibleRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface CollapsibleRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  CollapsibleRootProviderBaseProps {}

export function CollapsibleRootProvider(props: CollapsibleRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const collapsible = () => providerProps.value()
  const mergedProps = mergeProps(() => collapsible().getRootProps(), localProps)

  return (
    <CollapsibleProvider value={collapsible}>
      <ui.div {...mergedProps} />
    </CollapsibleProvider>
  )
}
