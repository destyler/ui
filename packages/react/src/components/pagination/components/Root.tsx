import type { UsePaginationProps } from '../hooks/use-pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { splitPaginationProps } from '../hooks/split-pagination-props'
import { usePagination } from '../hooks/use-pagination'
import { PaginationProvider } from '../hooks/use-pagination-context'

export interface PaginationRootBaseProps extends UsePaginationProps, PolymorphicProps {}
export interface PaginationRootProps extends HTMLProps<'nav'>, PaginationRootBaseProps {}

export const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>((props, ref) => {
  const [usePaginationProps, localProps] = splitPaginationProps(props)
  const pagination = usePagination(usePaginationProps)
  const mergedProps = mergeProps(pagination.getRootProps(), localProps)

  return (
    <PaginationProvider value={pagination}>
      <ui.nav {...mergedProps} ref={ref} />
    </PaginationProvider>
  )
})

PaginationRoot.displayName = 'PaginationRoot'
