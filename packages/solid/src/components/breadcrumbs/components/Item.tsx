import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

interface ItemProps {
  item: BreadcrumbItem
}

export interface BreadcrumbsItemBaseProps extends ItemProps, PolymorphicProps<'li'> {}
export interface BreadcrumbsItemProps extends HTMLProps<'li'>, BreadcrumbsItemBaseProps {}

export function BreadcrumbsItem(props: BreadcrumbsItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item'])
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(() => breadcrumbs().getItemProps(itemProps.item), localProps)

  return <ui.li {...mergedProps} />
}
