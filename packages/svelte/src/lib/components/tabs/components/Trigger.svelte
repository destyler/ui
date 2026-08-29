<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { TriggerProps } from '@destyler/tabs'

  export interface TabsTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
  export interface TabsTriggerProps extends Assign<HTMLProps<'button'>, TabsTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { useTabsContext } from '../hooks/use-tabs-context'

  const props: TabsTriggerProps = $props()
  const [triggerProps, localProps] = $derived(
    createSplitProps<TriggerProps>()(props, ['value', 'disabled']),
  )
  const tabs = useTabsContext()
  const mergedProps = $derived(mergeProps(tabs().getTriggerProps(triggerProps), localProps))
</script>

<UI as="button" {...mergedProps} />
