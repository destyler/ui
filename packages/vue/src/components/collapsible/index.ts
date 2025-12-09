export { collapsibleAnatomy } from './anatomy'
export {
  default as CollapsibleContent,
  type CollapsibleContentProps,
} from './components/Content.vue'
export {
  default as CollapsibleContext,
  type CollapsibleContextProps,
} from './components/Context.vue'
export {
  default as CollapsibleRoot,
  type CollapsibleRootEmits,
  type CollapsibleRootProps,
} from './components/Root.vue'
export {
  default as CollapsibleRootProvider,
  type CollapsibleRootProviderProps,
} from './components/RootProvider.vue'
export {
  default as CollapsibleTrigger,
  type CollapsibleTriggerProps,
} from './components/Trigger.vue'
export { useCollapsible, type UseCollapsibleProps, type UseCollapsibleReturn } from './composables/use-collapsible'
export { useCollapsibleContext, type UseCollapsibleContext } from './composables/use-collapsible-context'

export * as Collapsible from './namespace'

export type { OpenChangeDetails as CollapsibleOpenChangeDetails } from '@destyler/collapsible'
