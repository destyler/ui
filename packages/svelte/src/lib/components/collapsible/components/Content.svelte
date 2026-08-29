<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CollapsibleContentBaseProps extends PolymorphicProps<'div'> {}
  export interface CollapsibleContentProps extends Assign<HTMLProps<'div'>, CollapsibleContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCollapsibleContext } from '../hooks/use-collapsible-context'

  const props: CollapsibleContentProps = $props()

  const collapsible = useCollapsibleContext()
  const mergedProps = $derived(mergeProps(collapsible().getContentProps(), props))
</script>

{#if !collapsible().isUnmounted}
  <UI as="div" {...mergedProps} />
{/if}
