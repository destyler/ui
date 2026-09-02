export { paginationAnatomy } from './anatomy'
export { PaginationContext, type PaginationContextProps } from './components/Context'
export {
  PaginationEllipsis,
  type PaginationEllipsisBaseProps,
  type PaginationEllipsisProps,
} from './components/Ellipsis'
export {
  PaginationItem,
  type PaginationItemBaseProps,
  type PaginationItemProps,
} from './components/Item'
export {
  PaginationNextTrigger,
  type PaginationNextTriggerBaseProps,
  type PaginationNextTriggerProps,
} from './components/NextTrigger'
export {
  PaginationPrevTrigger,
  type PaginationPrevTriggerBaseProps,
  type PaginationPrevTriggerProps,
} from './components/PrevTrigger'
export {
  PaginationRoot,
  type PaginationRootBaseProps,
  type PaginationRootProps,
} from './components/Root'
export {
  PaginationRootProvider,
  type PaginationRootProviderBaseProps,
  type PaginationRootProviderProps,
} from './components/RootProvider'
export { usePagination, type UsePaginationProps, type UsePaginationReturn } from './hooks/use-pagination'
export { usePaginationContext, type UsePaginationContext } from './hooks/use-pagination-context'
export * as Pagination from './namespace'

export type {
  ItemLabelDetails as PaginationItemLabelDetails,
  PageChangeDetails as PaginationPageChangeDetails,
  PageSizeChangeDetails as PaginationPageSizeChangeDetails,
} from '@destyler/pagination'
