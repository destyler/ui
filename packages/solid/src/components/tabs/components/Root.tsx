import type { UseTabsProps } from '../hooks/use-tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { useTabs } from '../hooks/use-tabs'
import { TabsProvider } from '../hooks/use-tabs-context'

export interface TabsRootBaseProps
  extends UseTabsProps,
  RenderStrategyProps,
  PolymorphicProps<'div'> {}
export interface TabsRootProps extends HTMLProps<'div'>, TabsRootBaseProps {}

export function TabsRoot(props: TabsRootProps) {
  const [renderStrategyProps, tabsProps] = splitRenderStrategyProps(props)
  const [useTabsProps, restProps] = createSplitProps<UseTabsProps>()(tabsProps, [
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

  const api = useTabs(useTabsProps)
  const mergedProps = mergeProps(() => api().getRootProps(), restProps)

  return (
    <TabsProvider value={api}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} />
      </RenderStrategyProvider>
    </TabsProvider>
  )
}
