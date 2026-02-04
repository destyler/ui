import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabListBaseProps extends PolymorphicProps {}
export interface TabListProps extends HTMLProps<'div'>, TabListBaseProps {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>((props, ref) => {
  const tabs = useTabsContext()
  const mergedProps = mergeProps(tabs.getListProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TabList.displayName = 'TabList'
