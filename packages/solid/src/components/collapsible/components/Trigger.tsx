import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCollapsibleContext } from '../hooks/use-collapsible-context'

export interface CollapsibleTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CollapsibleTriggerProps extends HTMLProps<'button'>, CollapsibleTriggerBaseProps {}

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const api = useCollapsibleContext()
  const mergedProps = mergeProps(() => api().getTriggerProps(), props)
  return <ui.button {...mergedProps} />
}
