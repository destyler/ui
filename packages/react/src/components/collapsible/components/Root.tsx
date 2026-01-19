import type { UseCollapsibleProps } from '../hooks/use-collapsible'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { splitCollapsibleProps } from '../hooks/split-collapsible-props'
import { useCollapsible } from '../hooks/use-collapsible'
import { CollapsibleProvider } from '../hooks/use-collapsible-context'

export interface CollapsibleRootBaseProps extends UseCollapsibleProps, PolymorphicProps {}
export interface CollapsibleRootProps extends HTMLProps<'div'>, CollapsibleRootBaseProps {}

export const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleRootProps>((props, ref) => {
  const [useCollapsibleProps, localProps] = splitCollapsibleProps(props)
  const collapsible = useCollapsible(useCollapsibleProps)
  const mergedProps = mergeProps(collapsible.getRootProps(), localProps)

  return (
    <CollapsibleProvider value={collapsible}>
      <ui.div {...mergedProps} ref={ref} />
    </CollapsibleProvider>
  )
})

CollapsibleRoot.displayName = 'CollapsibleRoot'
