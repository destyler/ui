import type { UseTabsProps } from '../hooks/use-tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {
  RenderStrategyPropsProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { useTabs } from '../hooks/use-tabs'
import { TabsProvider } from '../hooks/use-tabs-context'

export interface TabsRootBaseProps extends UseTabsProps, RenderStrategyProps, PolymorphicProps {}
export interface TabsRootProps extends Assign<HTMLProps<'div'>, TabsRootBaseProps> {}

export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>((props, ref) => {
  const [renderStrategyProps, tabsProps] = splitRenderStrategyProps(props)
  const [useTabsProps, localprops] = createSplitProps<UseTabsProps>()(tabsProps, [
    'activationMode',
    'composite',
    'defaultValue',
    'deselectable',
    'id',
    'ids',
    'loopFocus',
    'navigate',
    'onFocusChange',
    'onValueChange',
    'orientation',
    'translations',
    'value',
  ])
  const tabs = useTabs(useTabsProps)
  const mergedProps = mergeProps(tabs.getRootProps(), localprops)

  return (
    <TabsProvider value={tabs}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} ref={ref} />
      </RenderStrategyPropsProvider>
    </TabsProvider>
  )
})

TabsRoot.displayName = 'TabsRoot'
