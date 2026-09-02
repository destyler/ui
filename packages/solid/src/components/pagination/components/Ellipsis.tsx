import type { EllipsisProps } from '@destyler/pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationEllipsisBaseProps extends EllipsisProps, PolymorphicProps<'div'> {}
export interface PaginationEllipsisProps extends HTMLProps<'div'>, PaginationEllipsisBaseProps {}

export function PaginationEllipsis(props: PaginationEllipsisProps) {
  const [ellipsisProps, localProps] = createSplitProps<EllipsisProps>()(props, ['index'])

  const api = usePaginationContext()
  const mergedProps = mergeProps(() => api().getEllipsisProps(ellipsisProps), localProps)

  return <ui.div {...mergedProps} />
}
