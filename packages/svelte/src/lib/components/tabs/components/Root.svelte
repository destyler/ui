<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseTabsProps } from '../hooks/use-tabs.svelte'

  export interface TabsRootBaseProps
    extends Optional<UseTabsProps, 'id'>,
      RenderStrategyProps,
      PolymorphicProps<'div'> {}
  export interface TabsRootProps extends Assign<HTMLProps<'div'>, TabsRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import {
    RenderStrategyPropsProvider,
    splitRenderStrategyProps,
    type RenderStrategyProps,
  } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { TabsProvider } from '../hooks/use-tabs-context'
  import { useTabs } from '../hooks/use-tabs.svelte'

  let { value = $bindable(), ...props }: TabsRootProps = $props()

  const [renderStrategyProps, tabsProps] = $derived(splitRenderStrategyProps(props))

  const id = $props.id()

  const [useTabsProps, localProps] = $derived.by(() => {
    const props = { ...tabsProps, value }
    return createSplitProps<Optional<UseTabsProps, 'id'>>()(props, [
      'value',
      'onValueChange',
      'onFocusChange',
      'orientation',
      'activationMode',
      'id',
      'ids',
      'loopFocus',
      'translations',
      'defaultValue',
      'composite',
      'deselectable',
      'navigate',
    ])
  })

  const machineProps = $derived.by<UseTabsProps>(() => ({
    ...useTabsProps,
    id: useTabsProps.id ?? id,
    value,
    onValueChange(details) {
      useTabsProps.onValueChange?.(details)
      if (value !== undefined) value = details.value
    },
  }))

  const tabs = useTabs(() => machineProps)
  const mergedProps = $derived(mergeProps(tabs().getRootProps(), localProps))

  TabsProvider(() => tabs())
  RenderStrategyPropsProvider(() => renderStrategyProps)
</script>

<UI as="div" {...mergedProps} />
