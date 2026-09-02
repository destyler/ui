export { collapseAnatomy } from './anatomy'
export { CollapseContext, type CollapseContextProps } from './components/Context'
export {
  CollapseItem,
  type CollapseItemBaseProps,
  type CollapseItemProps,
} from './components/Item'
export {
  CollapseItemContent,
  type CollapseItemContentBaseProps,
  type CollapseItemContentProps,
} from './components/ItemContent'
export { CollapseItemContext, type CollapseItemContextProps } from './components/ItemContext'
export {
  CollapseItemIndicator,
  type CollapseItemIndicatorBaseProps,
  type CollapseItemIndicatorProps,
} from './components/ItemIndicator'
export {
  CollapseItemTrigger,
  type CollapseItemTriggerBaseProps,
  type CollapseItemTriggerProps,
} from './components/ItemTrigger'
export {
  CollapseRoot,
  type CollapseRootBaseProps,
  type CollapseRootProps,
} from './components/Root'
export {
  CollapseRootProvider,
  type CollapseRootProviderBaseProps,
  type CollapseRootProviderProps,
} from './components/RootProvider'
export { useCollapse, type UseCollapseProps, type UseCollapseReturn } from './hooks/use-collapse'
export { useCollapseContext, type UseCollapseContext } from './hooks/use-collapse-context'
export { useCollapseItemContext, type UseCollapseItemContext } from './hooks/use-collapse-item-context'
export * as Collapse from './namespace'

export type {
  FocusChangeDetails as CollapseFocusChangeDetails,
  ValueChangeDetails as CollapseValueChangeDetails,
} from '@destyler/collapse'
