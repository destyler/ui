import type { JSX } from 'solid-js'
import type { UseBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsContextProps {
  children: (context: UseBreadcrumbsContext) => JSX.Element
}

export function BreadcrumbsContext(props: BreadcrumbsContextProps) {
  return props.children(useBreadcrumbsContext())
}
