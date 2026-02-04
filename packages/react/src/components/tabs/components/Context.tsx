import type { ReactNode } from 'react'
import type { UseTabsContext } from '../hooks/use-tabs-context'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabsContextProps {
  children: (context: UseTabsContext) => ReactNode
}

export const TabsContext = (props: TabsContextProps) => props.children(useTabsContext())
