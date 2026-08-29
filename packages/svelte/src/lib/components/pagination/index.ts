export { paginationAnatomy } from './anatomy'
export { default as PaginationContext, type PaginationContextProps } from './components/Context.svelte'
export {
  default as PaginationEllipsis,
  type PaginationEllipsisBaseProps,
  type PaginationEllipsisProps,
} from './components/Ellipsis.svelte'
export {
  default as PaginationItem,
  type PaginationItemBaseProps,
  type PaginationItemProps,
} from './components/Item.svelte'
export {
  default as PaginationNextTrigger,
  type PaginationNextTriggerBaseProps,
  type PaginationNextTriggerProps,
} from './components/NextTrigger.svelte'
export {
  default as PaginationPrevTrigger,
  type PaginationPrevTriggerBaseProps,
  type PaginationPrevTriggerProps,
} from './components/PrevTrigger.svelte'
export {
  default as PaginationRoot,
  type PaginationRootBaseProps,
  type PaginationRootProps,
} from './components/Root.svelte'
export {
  default as PaginationRootProvider,
  type PaginationRootProviderBaseProps,
  type PaginationRootProviderProps,
} from './components/RootProvider.svelte'
export { usePaginationContext, type UsePaginationContext } from './hooks/use-pagination-context'
export { usePagination, type UsePaginationProps, type UsePaginationReturn } from './hooks/use-pagination.svelte'
export * as Pagination from './namespace'

export type {
  ItemLabelDetails as PaginationItemLabelDetails,
  PageChangeDetails as PaginationPageChangeDetails,
  PageSizeChangeDetails as PaginationPageSizeChangeDetails,
} from '@destyler/pagination'
