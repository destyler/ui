import type { UsePaginationProps } from '../hooks/use-pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { usePagination } from '../hooks/use-pagination'
import { PaginationProvider } from '../hooks/use-pagination-context'

export interface PaginationRootBaseProps extends UsePaginationProps, PolymorphicProps<'nav'> {}
export interface PaginationRootProps extends HTMLProps<'nav'>, PaginationRootBaseProps {}

export function PaginationRoot(props: PaginationRootProps) {
  const [usePaginationProps, localProps] = createSplitProps<UsePaginationProps>()(props, [
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
  const api = usePagination(usePaginationProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <PaginationProvider value={api}>
      <ui.nav {...mergedProps} />
    </PaginationProvider>
  )
}
