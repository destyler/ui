import type { ItemProps } from '@destyler/pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
export interface PaginationItemProps extends Assign<HTMLProps<'button'>, PaginationItemBaseProps> {}

export function PaginationItem(props: PaginationItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'type'])

  const api = usePaginationContext()
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps)

  return <ui.button {...mergedProps} />
}
