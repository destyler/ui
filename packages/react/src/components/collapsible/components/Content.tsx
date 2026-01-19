import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCollapsibleContext } from '../hooks/use-collapsible-context'

export interface CollapsibleContentBaseProps extends PolymorphicProps {}
export interface CollapsibleContentProps extends HTMLProps<'div'>, CollapsibleContentBaseProps {}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>((props, ref) => {
  const collapsible = useCollapsibleContext()

  if (collapsible.isUnmounted) {
    return null
  }

  const mergedProps = mergeProps(collapsible.getContentProps(), props)
  return <ui.div {...mergedProps} ref={ref} />
})

CollapsibleContent.displayName = 'CollapsibleContent'
