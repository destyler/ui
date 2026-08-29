export { default as Context, type PaginationContextProps as ContextProps } from './components/Context.svelte'
export {
  default as Ellipsis,
  type PaginationEllipsisBaseProps as EllipsisBaseProps,
  type PaginationEllipsisProps as EllipsisProps,
} from './components/Ellipsis.svelte'
export {
  default as Item,
  type PaginationItemBaseProps as ItemBaseProps,
  type PaginationItemProps as ItemProps,
} from './components/Item.svelte'
export {
  default as NextTrigger,
  type PaginationNextTriggerBaseProps as NextTriggerBaseProps,
  type PaginationNextTriggerProps as NextTriggerProps,
} from './components/NextTrigger.svelte'
export {
  default as PrevTrigger,
  type PaginationPrevTriggerBaseProps as PrevTriggerBaseProps,
  type PaginationPrevTriggerProps as PrevTriggerProps,
} from './components/PrevTrigger.svelte'
export {
  default as Root,
  type PaginationRootBaseProps as RootBaseProps,
  type PaginationRootProps as RootProps,
} from './components/Root.svelte'
export {
  default as RootProvider,
  type PaginationRootProviderBaseProps as RootProviderBaseProps,
  type PaginationRootProviderProps as RootProviderProps,
} from './components/RootProvider.svelte'
export type { ItemLabelDetails, PageChangeDetails, PageSizeChangeDetails } from '@destyler/pagination'
