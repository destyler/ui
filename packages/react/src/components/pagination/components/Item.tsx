import type { ItemProps } from '@destyler/pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationItemBaseProps extends ItemProps, PolymorphicProps {}
export interface PaginationItemProps extends Assign<HTMLProps<'button'>, PaginationItemBaseProps> {}

export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'type'])
  const pagination = usePaginationContext()
  const mergedProps = mergeProps(pagination.getItemProps(itemProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

PaginationItem.displayName = 'PaginationItem'
