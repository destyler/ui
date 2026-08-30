import type { UseTabsReturn } from '../hooks/use-tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { TabsProvider } from '../hooks/use-tabs-context'

interface RootProviderProps {
  value: UseTabsReturn
}

export interface TabsRootProviderBaseProps
  extends RootProviderProps,
  RenderStrategyProps,
  PolymorphicProps<'div'> {}
export interface TabsRootProviderProps extends HTMLProps<'div'>, TabsRootProviderBaseProps {}

export function TabsRootProvider(props: TabsRootProviderProps) {
  const [renderStrategyProps, tabsProps] = splitRenderStrategyProps(props)
  const [{ value: tabs }, localprops] = createSplitProps<RootProviderProps>()(tabsProps, ['value'])
  const mergedProps = mergeProps(() => tabs().getRootProps(), localprops)

  return (
    <TabsProvider value={tabs}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} />
      </RenderStrategyProvider>
    </TabsProvider>
  )
}
