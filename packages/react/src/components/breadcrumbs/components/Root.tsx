import type { UseBreadcrumbsProps } from '../hooks/use-breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useBreadcrumbs } from '../hooks/use-breadcrumbs'
import { BreadcrumbsProvider } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsRootBaseProps extends UseBreadcrumbsProps, PolymorphicProps {}
export interface BreadcrumbsRootProps extends Assign<HTMLProps<'nav'>, BreadcrumbsRootBaseProps> {}

export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsRootProps>((props, ref) => {
  const [useBreadcrumbsProps, localProps] = createSplitProps<UseBreadcrumbsProps>()(props, [
    'id',
    'ids',
    'items',
  ])

  const breadcrumbs = useBreadcrumbs(useBreadcrumbsProps)
  const mergedProps = mergeProps(breadcrumbs.getRootProps(), localProps)

  return (
    <BreadcrumbsProvider value={breadcrumbs}>
      <ui.nav {...mergedProps} ref={ref} />
    </BreadcrumbsProvider>
  )
})

BreadcrumbsRoot.displayName = 'BreadcrumbsRoot'
