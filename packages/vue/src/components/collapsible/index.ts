export { collapsibleAnatomy } from './anatomy'
export {
  default as CollapsibleContent,
  type CollapsibleContentBaseProps,
  type CollapsibleContentProps,
} from './components/Content.vue'
export { default as CollapsibleContext, type CollapsibleContextProps } from './components/Context.vue'
export {
  default as CollapsibleRoot,
  type CollapsibleRootBaseProps,
  type CollapsibleRootEmits,
  type CollapsibleRootProps,
} from './components/Root.vue'
export {
  default as CollapsibleRootProvider,
  type CollapsibleRootProviderBaseProps,
  type CollapsibleRootProviderProps,
} from './components/RootProvider.vue'
export {
  default as CollapsibleTrigger,
  type CollapsibleTriggerBaseProps,
  type CollapsibleTriggerProps,
} from './components/Trigger.vue'
export { useCollapsible, type UseCollapsibleProps, type UseCollapsibleReturn } from './composables/use-collapsible'
export { useCollapsibleContext, type UseCollapsibleContext } from './composables/use-collapsible-context'

export * as Collapsible from './namespace'

export type { OpenChangeDetails as CollapsibleOpenChangeDetails } from '@destyler/collapsible'
