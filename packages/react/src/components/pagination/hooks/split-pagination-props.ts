import type { UsePaginationProps } from './use-pagination'
import { createSplitProps } from '~/utils/create-split-props'

export function splitPaginationProps<T extends UsePaginationProps>(props: T) {
  return createSplitProps<UsePaginationProps>()(props, [
    'count',
    'defaultPage',
    'id',
    'ids',
    'onPageChange',
    'onPageSizeChange',
    'page',
    'pageSize',
    'siblingCount',
    'translations',
    'type',
  ])
}
