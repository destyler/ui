import type { UseBreadcrumbsReturn } from '../hooks/use-breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { BreadcrumbsProvider } from '../hooks/use-breadcrumbs-context'

export interface BreadcrumbsRootProviderBaseProps extends PolymorphicProps {
  value: UseBreadcrumbsReturn
}
export interface BreadcrumbsRootProviderProps extends Assign<HTMLProps<'nav'>, BreadcrumbsRootProviderBaseProps> {}

export const BreadcrumbsRootProvider = forwardRef<HTMLElement, BreadcrumbsRootProviderProps>(
  (props, ref) => {
    const { value: breadcrumbs, ...localProps } = props
    const mergedProps = mergeProps(breadcrumbs.getRootProps(), localProps)

    return (
      <BreadcrumbsProvider value={breadcrumbs}>
        <ui.nav {...mergedProps} ref={ref} />
      </BreadcrumbsProvider>
    )
  },
)

BreadcrumbsRootProvider.displayName = 'BreadcrumbsRootProvider'
