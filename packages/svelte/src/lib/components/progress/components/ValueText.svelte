<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressValueTextBaseProps extends PolymorphicProps<'span'> {}
  export interface ProgressValueTextProps extends Assign<HTMLProps<'span'>, ProgressValueTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const { children, ...rest }: ProgressValueTextProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getValueTextProps(), rest))
</script>

<UI as="span" {...mergedProps}>
  {#if children}
    {@render children()}
  {:else}
    {progress().percentAsString}
  {/if}
</UI>
