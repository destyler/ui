import type { UsePaginationReturn } from '../hooks/use-pagination'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { PaginationProvider } from '../hooks/use-pagination-context'

interface RootProviderProps {
  value: UsePaginationReturn
}

export interface PaginationRootProviderBaseProps extends PolymorphicProps<'nav'> {}
export interface PaginationRootProviderProps
  extends HTMLProps<'nav'>,
  RootProviderProps,
  PaginationRootProviderBaseProps {}

export function PaginationRootProvider(props: PaginationRootProviderProps) {
  const [{ value: pagination }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const mergedProps = mergeProps(() => pagination().getRootProps(), localProps)

  return (
    <PaginationProvider value={pagination}>
      <ui.nav {...mergedProps} />
    </PaginationProvider>
  )
}
