import type { UseTabsReturn } from '../hooks/use-tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyPropsProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { TabsProvider } from '../hooks/use-tabs-context'

interface RootProviderProps {
  value: UseTabsReturn
}

export interface TabsRootProviderBaseProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
export interface TabsRootProviderProps extends HTMLProps<'div'>, TabsRootProviderBaseProps {}

export const TabsRootProvider = forwardRef<HTMLDivElement, TabsRootProviderProps>((props, ref) => {
  const [renderStrategyProps, tabsProps] = splitRenderStrategyProps(props)
  const [{ value: tabs }, localprops] = createSplitProps<RootProviderProps>()(tabsProps, ['value'])
  const mergedProps = mergeProps(tabs.getRootProps(), localprops)

  return (
    <TabsProvider value={tabs}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} ref={ref} />
      </RenderStrategyPropsProvider>
    </TabsProvider>
  )
})

TabsRootProvider.displayName = 'TabsRootProvider'
