export { tabsAnatomy } from './anatomy'
export {
  default as TabsContent,
  type TabsContentBaseProps,
  type TabsContentProps,
} from './components/Content.svelte'
export { default as TabsContext, type TabsContextProps } from './components/Context.svelte'
export {
  default as TabsIndicator,
  type TabsIndicatorBaseProps,
  type TabsIndicatorProps,
} from './components/Indicator.svelte'
export {
  default as TabsList,
  type TabsListBaseProps,
  type TabsListProps,
} from './components/List.svelte'
export { default as TabsRoot, type TabsRootBaseProps, type TabsRootProps } from './components/Root.svelte'
export {
  default as TabsRootProvider,
  type TabsRootProviderBaseProps,
  type TabsRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as TabsTrigger,
  type TabsTriggerBaseProps,
  type TabsTriggerProps,
} from './components/Trigger.svelte'
export { useTabsContext, type UseTabsContext } from './hooks/use-tabs-context'
export { useTabs, type UseTabsProps, type UseTabsReturn } from './hooks/use-tabs.svelte'
export * as Tabs from './namespace'

export type {
  FocusChangeDetails as TabsFocusChangeDetails,
  ValueChangeDetails as TabsValueChangeDetails,
} from '@destyler/tabs'
