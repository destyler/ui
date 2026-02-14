import type { ReactNode } from 'react'
import type { UseBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsContextProps {
  children: (context: UseBreadcrumbsContext) => ReactNode
}

export function BreadcrumbsContext(props: BreadcrumbsContextProps) {
  return props.children(useBreadcrumbsContext())
}
