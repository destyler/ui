export { collapseAnatomy } from './anatomy'
export { default as CollapseContext, type CollapseContextProps } from './components/Context.svelte'
export { default as CollapseItem, type CollapseItemBaseProps, type CollapseItemProps } from './components/Item.svelte'
export {
  default as CollapseItemContent,
  type CollapseItemContentBaseProps,
  type CollapseItemContentProps,
} from './components/ItemContent.svelte'
export { default as CollapseItemContext, type CollapseItemContextProps } from './components/ItemContext.svelte'
export {
  default as CollapseItemIndicator,
  type CollapseItemIndicatorBaseProps,
  type CollapseItemIndicatorProps,
} from './components/ItemIndicator.svelte'
export {
  default as CollapseItemTrigger,
  type CollapseItemTriggerBaseProps,
  type CollapseItemTriggerProps,
} from './components/ItemTrigger.svelte'
export { default as CollapseRoot, type CollapseRootBaseProps, type CollapseRootProps } from './components/Root.svelte'
export {
  default as CollapseRootProvider,
  type CollapseRootProviderBaseProps,
  type CollapseRootProviderProps,
} from './components/RootProvider.svelte'
export { useCollapseContext, type UseCollapseContext } from './hooks/use-collapse-context'
export { useCollapseItemContext, type UseCollapseItemContext } from './hooks/use-collapse-item-context'
export { useCollapse, type UseCollapseProps, type UseCollapseReturn } from './hooks/use-collapse.svelte'
export * as Collapse from './namespace'

export type {
  FocusChangeDetails as CollapseFocusChangeDetails,
  ValueChangeDetails as CollapseValueChangeDetails,
} from '@destyler/collapse'
