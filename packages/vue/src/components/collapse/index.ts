export { collapseAnatomy } from './anatomy'
export {
  default as CollapseContext,
  type CollapseContextProps,
} from './components/Context.vue'
export {
  default as CollapseItem,
  type CollapseItemProps,
} from './components/Item.vue'
export {
  default as CollapseItemContent,
  type CollapseItemContentProps,
} from './components/ItemContent.vue'
export { default as CollapseItemContext, type CollapseItemContextProps } from './components/ItemContext.vue'
export {
  default as CollapseItemIndicator,
  type CollapseItemIndicatorProps,
} from './components/ItemIndicator.vue'
export {
  default as CollapseItemTrigger,
  type CollapseItemTriggerProps,
} from './components/ItemTrigger.vue'
export {
  default as CollapseRoot,
  type CollapseRootEmits,
  type CollapseRootProps,
} from './components/Root.vue'
export {
  default as CollapseRootProvider,
  type CollapseRootProviderProps,
} from './components/RootProvider.vue'
export { useCollapse, type UseCollapseProps, type UseCollapseReturn } from './composables/use-collapse'
export { useCollapseContext, type UseCollapseContext } from './composables/use-collapse-context'
export { useCollapseItemContext, type UseCollapseItemContext } from './composables/use-collapse-item-context'
export type {
  FocusChangeDetails as CollapseFocusChangeDetails,
  ValueChangeDetails as CollapseValueChangeDetails,
} from '@destyler/collapse'
