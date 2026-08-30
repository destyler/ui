import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

interface ItemProps {
  item: BreadcrumbItem
}

export interface BreadcrumbsLinkBaseProps extends ItemProps, PolymorphicProps<'a'> {}
export interface BreadcrumbsLinkProps extends HTMLProps<'a'>, BreadcrumbsLinkBaseProps {}

export function BreadcrumbsLink(props: BreadcrumbsLinkProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item'])
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(() => breadcrumbs().getLinkProps(itemProps.item), localProps)

  return <ui.a {...mergedProps} />
}
