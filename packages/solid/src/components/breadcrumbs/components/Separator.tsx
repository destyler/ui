import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsSeparatorBaseProps extends PolymorphicProps<'span'> {}
export interface BreadcrumbsSeparatorProps
  extends HTMLProps<'span'>,
  BreadcrumbsSeparatorBaseProps {}

export function BreadcrumbsSeparator(props: BreadcrumbsSeparatorProps) {
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(() => breadcrumbs().getSeparatorProps(), props)

  return <ui.span {...mergedProps} />
}
