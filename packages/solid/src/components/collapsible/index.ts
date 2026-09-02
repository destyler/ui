export { collapsibleAnatomy } from './anatomy'
export {
  CollapsibleContent,
  type CollapsibleContentBaseProps,
  type CollapsibleContentProps,
} from './components/Content'
export { CollapsibleContext, type CollapsibleContextProps } from './components/Context'
export {
  CollapsibleRoot,
  type CollapsibleRootBaseProps,
  type CollapsibleRootProps,
} from './components/Root'
export {
  CollapsibleRootProvider,
  type CollapsibleRootProviderBaseProps,
  type CollapsibleRootProviderProps,
} from './components/RootProvider'
export {
  CollapsibleTrigger,
  type CollapsibleTriggerBaseProps,
  type CollapsibleTriggerProps,
} from './components/Trigger'
export {
  useCollapsible,
  type UseCollapsibleProps,
  type UseCollapsibleReturn,
} from './hooks/use-collapsible'
export { useCollapsibleContext, type UseCollapsibleContext } from './hooks/use-collapsible-context'
export * as Collapsible from './namespace'

export type { OpenChangeDetails as CollapsibleOpenChangeDetails } from '@destyler/collapsible'
