import type { TriggerProps } from '@destyler/tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabTriggerBaseProps extends TriggerProps, PolymorphicProps {}
export interface TabTriggerProps extends Assign<HTMLProps<'button'>, TabTriggerBaseProps> {}

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>((props, ref) => {
  const [tabProps, localProps] = createSplitProps<TriggerProps>()(props, ['disabled', 'value'])
  const tabs = useTabsContext()
  const mergedProps = mergeProps(tabs.getTriggerProps(tabProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

TabTrigger.displayName = 'TabTrigger'
