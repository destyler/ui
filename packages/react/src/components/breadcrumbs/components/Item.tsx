import type { ItemProps } from '@destyler/breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsItemBaseProps extends ItemProps, PolymorphicProps {}
export interface BreadcrumbsItemProps extends Assign<HTMLProps<'li'>, BreadcrumbsItemBaseProps> {}

export const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbsItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item'])

  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(breadcrumbs.getItemProps(itemProps), localProps)

  return <ui.li {...mergedProps} ref={ref} />
})

BreadcrumbsItem.displayName = 'BreadcrumbsItem'
