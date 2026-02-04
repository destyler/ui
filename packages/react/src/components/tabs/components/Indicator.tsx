import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabIndicatorBaseProps extends PolymorphicProps {}
export interface TabIndicatorProps extends HTMLProps<'div'>, TabIndicatorBaseProps {}

export const TabIndicator = forwardRef<HTMLDivElement, TabIndicatorProps>((props, ref) => {
  const tabs = useTabsContext()
  const mergedProps = mergeProps(tabs.getIndicatorProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TabIndicator.displayName = 'TabIndicator'
