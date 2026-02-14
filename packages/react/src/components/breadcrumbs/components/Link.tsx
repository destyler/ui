import type { ItemProps } from '@destyler/breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsLinkBaseProps extends ItemProps, PolymorphicProps {}
export interface BreadcrumbsLinkProps extends Assign<HTMLProps<'a'>, BreadcrumbsLinkBaseProps> {}

export const BreadcrumbsLink = forwardRef<HTMLAnchorElement, BreadcrumbsLinkProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item'])

  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(breadcrumbs.getLinkProps(itemProps), localProps)

  return <ui.a {...mergedProps} ref={ref} />
})

BreadcrumbsLink.displayName = 'BreadcrumbsLink'
