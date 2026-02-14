import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsSeparatorBaseProps extends PolymorphicProps {}
export interface BreadcrumbsSeparatorProps extends Assign<HTMLProps<'span'>, BreadcrumbsSeparatorBaseProps> {}

export const BreadcrumbsSeparator = forwardRef<HTMLSpanElement, BreadcrumbsSeparatorProps>(
  (props, ref) => {
    const breadcrumbs = useBreadcrumbsContext()
    const mergedProps = mergeProps(breadcrumbs.getSeparatorProps(), props)

    return <ui.span {...mergedProps} ref={ref} />
  },
)

BreadcrumbsSeparator.displayName = 'BreadcrumbsSeparator'
