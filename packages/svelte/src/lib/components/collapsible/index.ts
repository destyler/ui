export { collapsibleAnatomy } from './anatomy'
export {
  default as CollapsibleContent,
  type CollapsibleContentBaseProps,
  type CollapsibleContentProps,
} from './components/Content.svelte'
export { default as CollapsibleContext, type CollapsibleContextProps } from './components/Context.svelte'
export {
  default as CollapsibleRoot,
  type CollapsibleRootBaseProps,
  type CollapsibleRootProps,
} from './components/Root.svelte'
export {
  default as CollapsibleRootProvider,
  type CollapsibleRootProviderBaseProps,
  type CollapsibleRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as CollapsibleTrigger,
  type CollapsibleTriggerBaseProps,
  type CollapsibleTriggerProps,
} from './components/Trigger.svelte'
export { splitCollapsibleProps } from './hooks/split-collapsible-props.svelte'
export { useCollapsibleContext, type UseCollapsibleContext } from './hooks/use-collapsible-context'
export { useCollapsible, type UseCollapsibleProps, type UseCollapsibleReturn } from './hooks/use-collapsible.svelte'
export * as Collapsible from './namespace'

export type { OpenChangeDetails as CollapsibleOpenChangeDetails } from '@destyler/collapsible'
