import type { UseBreadcrumbsReturn } from '../hooks/use-breadcrumbs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { BreadcrumbsProvider } from '../hooks/use-breadcrumbs-context'

interface RootProviderProps {
  value: UseBreadcrumbsReturn
}

export interface BreadcrumbsRootProviderBaseProps
  extends RootProviderProps,
  PolymorphicProps<'nav'> {}
export interface BreadcrumbsRootProviderProps
  extends HTMLProps<'nav'>,
  BreadcrumbsRootProviderBaseProps {}

export function BreadcrumbsRootProvider(props: BreadcrumbsRootProviderProps) {
  const [{ value: breadcrumbs }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const mergedProps = mergeProps(() => breadcrumbs().getRootProps(), localProps)

  return (
    <BreadcrumbsProvider value={breadcrumbs}>
      <ui.nav {...mergedProps} />
    </BreadcrumbsProvider>
  )
}
