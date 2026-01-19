import type { UseCollapsibleReturn } from '../hooks/use-collapsible'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CollapsibleProvider } from '../hooks/use-collapsible-context'

interface RootProviderProps {
  value: UseCollapsibleReturn
}

export interface CollapsibleRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface CollapsibleRootProviderProps extends HTMLProps<'div'>, CollapsibleRootProviderBaseProps {}

export const CollapsibleRootProvider = forwardRef<HTMLDivElement, CollapsibleRootProviderProps>((props, ref) => {
  const [{ value: collapsible }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(collapsible.getRootProps(), localProps)

  return (
    <CollapsibleProvider value={collapsible}>
      <ui.div {...mergedProps} ref={ref} />
    </CollapsibleProvider>
  )
})

CollapsibleRootProvider.displayName = 'CollapsibleRootProvider'
