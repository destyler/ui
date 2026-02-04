import type { UsePaginationReturn } from '../hooks/use-pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { PaginationProvider } from '../hooks/use-pagination-context'

interface RootProviderProps {
  value: UsePaginationReturn
}

export interface PaginationRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface PaginationRootProviderProps extends HTMLProps<'nav'>, PaginationRootProviderBaseProps {}

export const PaginationRootProvider = forwardRef<HTMLElement, PaginationRootProviderProps>((props, ref) => {
  const [{ value: pagination }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(pagination.getRootProps(), localProps)

  return (
    <PaginationProvider value={pagination}>
      <ui.nav {...mergedProps} ref={ref} />
    </PaginationProvider>
  )
})

PaginationRootProvider.displayName = 'PaginationRootProvider'
