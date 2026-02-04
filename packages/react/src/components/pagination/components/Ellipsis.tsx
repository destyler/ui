import type { EllipsisProps } from '@destyler/pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationEllipsisBaseProps extends EllipsisProps, PolymorphicProps {}
export interface PaginationEllipsisProps extends HTMLProps<'div'>, PaginationEllipsisBaseProps {}

export const PaginationEllipsis = forwardRef<HTMLDivElement, PaginationEllipsisProps>((props, ref) => {
  const [ellipsisProps, localProps] = createSplitProps<EllipsisProps>()(props, ['index'])
  const pagination = usePaginationContext()
  const mergedProps = mergeProps(pagination.getEllipsisProps(ellipsisProps), localProps)

  return <ui.div {...mergedProps} ref={ref} />
})

PaginationEllipsis.displayName = 'PaginationEllipsis'
