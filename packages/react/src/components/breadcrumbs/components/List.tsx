import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsListBaseProps extends PolymorphicProps {}
export interface BreadcrumbsListProps extends Assign<HTMLProps<'ol'>, BreadcrumbsListBaseProps> {}

export const BreadcrumbsList = forwardRef<HTMLOListElement, BreadcrumbsListProps>((props, ref) => {
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = mergeProps(breadcrumbs.getListProps(), props)

  return <ui.ol {...mergedProps} ref={ref} />
})

BreadcrumbsList.displayName = 'BreadcrumbsList'
