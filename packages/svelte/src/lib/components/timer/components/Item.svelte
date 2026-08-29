<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import type { ItemProps } from '@destyler/timer'
  import { UI } from '../../factory'
  import { useTimerContext } from '../hooks/use-timer-context'

  export interface TimerItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
  export interface TimerItemProps extends Assign<HTMLProps<'div'>, TimerItemBaseProps> {}

  const props: TimerItemProps = $props()
  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['type']))

  const timer = useTimerContext()
  const mergedProps = $derived(mergeProps(timer().getItemProps(itemProps), localProps))
</script>

<UI as="div" {...mergedProps}>
  {#if mergedProps.children}
    {@render mergedProps.children?.()}
  {:else}
    {timer().formattedTime[itemProps.type]}
  {/if}
</UI>
