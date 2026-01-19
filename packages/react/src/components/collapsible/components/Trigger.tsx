import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCollapsibleContext } from '../hooks/use-collapsible-context'

export interface CollapsibleTriggerBaseProps extends PolymorphicProps {}
export interface CollapsibleTriggerProps extends HTMLProps<'button'>, CollapsibleTriggerBaseProps {}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>((props, ref) => {
  const collapsible = useCollapsibleContext()
  const mergedProps = mergeProps(collapsible.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CollapsibleTrigger.displayName = 'CollapsibleTrigger'
