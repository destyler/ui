import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsListBaseProps extends PolymorphicProps<'ol'> {}
export interface BreadcrumbsListProps extends HTMLProps<'ol'>, BreadcrumbsListBaseProps {}

export function BreadcrumbsList(props: BreadcrumbsListProps) {
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(() => breadcrumbs().getListProps(), props)

  return <ui.ol {...mergedProps} />
}
