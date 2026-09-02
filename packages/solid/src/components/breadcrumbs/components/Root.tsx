import type { UseBreadcrumbsProps } from '../hooks/use-breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useBreadcrumbs } from '../hooks/use-breadcrumbs'
import { BreadcrumbsProvider } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsRootBaseProps
  extends UseBreadcrumbsProps,
  PolymorphicProps<'nav'> {}
export interface BreadcrumbsRootProps extends HTMLProps<'nav'>, BreadcrumbsRootBaseProps {}

export function BreadcrumbsRoot(props: BreadcrumbsRootProps) {
  const [useBreadcrumbsProps, localProps] = createSplitProps<UseBreadcrumbsProps>()(props, [
    'id',
    'ids',
    'items',
  ])
  const breadcrumbs = useBreadcrumbs(useBreadcrumbsProps)
  const mergedProps = mergeProps(() => breadcrumbs().getRootProps(), localProps)

  return (
    <BreadcrumbsProvider value={breadcrumbs}>
      <ui.nav {...mergedProps} />
    </BreadcrumbsProvider>
  )
}
