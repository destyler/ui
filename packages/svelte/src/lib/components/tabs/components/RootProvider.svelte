<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseTabsReturn } from '../hooks/use-tabs.svelte'

  interface RootProviderProps {
    value: UseTabsReturn
  }

  export interface TabsRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'>, RenderStrategyProps {}
  export interface TabsRootProviderProps extends Assign<HTMLProps<'div'>, TabsRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { TabsProvider } from '../hooks/use-tabs-context'
  import {
    RenderStrategyPropsProvider,
    splitRenderStrategyProps,
    type RenderStrategyProps,
  } from '$lib/utils/render-strategy'

  const props: TabsRootProviderProps = $props()

  const [renderStrategyProps, tabsProps] = $derived(splitRenderStrategyProps(props))
  const [rootProviderProps, localProps] = $derived(createSplitProps<RootProviderProps>()(tabsProps, ['value']))

  const mergedProps = $derived(mergeProps(rootProviderProps.value().getRootProps(), localProps))

  TabsProvider(() => rootProviderProps.value())
  RenderStrategyPropsProvider(() => renderStrategyProps)
</script>

<UI as="div" {...mergedProps} />
