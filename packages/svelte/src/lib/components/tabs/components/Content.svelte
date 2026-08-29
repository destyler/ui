<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ContentProps } from '@destyler/tabs'

  export interface TabsContentBaseProps extends ContentProps, PolymorphicProps<'div'> {}
  export interface TabsContentProps extends Assign<HTMLProps<'div'>, TabsContentBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { useRenderStrategyPropsContext } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PresenceProvider, usePresence, type UsePresenceProps } from '../../presence'
  import { useTabsContext } from '../hooks/use-tabs-context'

  const props: TabsContentProps = $props()
  const [contentProps, localProps] = $derived(createSplitProps<ContentProps>()(props, ['value']))

  const tabs = useTabsContext()
  const renderStrategyProps = useRenderStrategyPropsContext()

  const machineProps = $derived.by<UsePresenceProps>(() => ({
    ...renderStrategyProps(),
    present: tabs().value === contentProps.value,
    immediate: true,
  }))

  const presence = usePresence(() => machineProps)

  const mergedProps = $derived(mergeProps(tabs().getContentProps(contentProps), localProps))

  PresenceProvider(() => presence())
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}
