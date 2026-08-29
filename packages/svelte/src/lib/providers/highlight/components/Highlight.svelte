<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import type { HTMLProps, Assign } from '$lib/types'
  import { useHighlight, type UseHighlightProps } from '../hooks/use-highlight.svelte'

  export interface HighlightBaseProps extends UseHighlightProps {}
  export interface HighlightProps extends Assign<HTMLProps<'mark'>, HighlightBaseProps> {}

  const props: HighlightProps = $props()

  const [highlightProps, localProps] = $derived(
    createSplitProps<HighlightBaseProps>()(props, ['query', 'text', 'ignoreCase', 'matchAll']),
  )

  $effect.pre(() => {
    if (typeof props.text !== 'string') throw new Error('[destyler-ui/highlight] text must be a string')
  })

  const chunks = useHighlight(() => highlightProps)
</script>

{#each chunks() as { text, match }}
  {#if match}
    <mark {...localProps}>{text}</mark>
  {:else}
    {text}
  {/if}
{/each}
