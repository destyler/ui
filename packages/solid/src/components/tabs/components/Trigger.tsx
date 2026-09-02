import type { TriggerProps } from '@destyler/tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface TabTriggerProps extends Assign<HTMLProps<'button'>, TabTriggerBaseProps> {}

export function TabTrigger(props: TabTriggerProps) {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['disabled', 'value'])
  const api = useTabsContext()
  const mergedProps = mergeProps(() => api().getTriggerProps(triggerProps), localProps)

  return <ui.button {...mergedProps} />
}
