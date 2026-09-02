export { tabsAnatomy } from './anatomy'
export { TabContent, type TabContentBaseProps, type TabContentProps } from './components/Content'
export { TabsContext, type TabsContextProps } from './components/Context'
export { TabIndicator, type TabIndicatorBaseProps, type TabIndicatorProps } from './components/Indicator'
export { TabList, type TabListBaseProps, type TabListProps } from './components/List'
export { TabsRoot, type TabsRootBaseProps, type TabsRootProps } from './components/Root'
export {
  TabsRootProvider,
  type TabsRootProviderBaseProps,
  type TabsRootProviderProps,
} from './components/RootProvider'
export { TabTrigger, type TabTriggerBaseProps, type TabTriggerProps } from './components/Trigger'
export { useTabs, type UseTabsProps, type UseTabsReturn } from './hooks/use-tabs'
export { useTabsContext, type UseTabsContext } from './hooks/use-tabs-context'
export * as Tabs from './namespace'

export type {
  FocusChangeDetails as TabsFocusChangeDetails,
  ValueChangeDetails as TabsValueChangeDetails,
} from '@destyler/tabs'
