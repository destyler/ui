<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourProgressTextBaseProps extends PolymorphicProps<'div'> {}
  export interface TourProgressTextProps extends Assign<HTMLProps<'div'>, TourProgressTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourProgressTextProps = $props()

  const tour = useTourContext()

  const mergedProps = $derived(mergeProps(tour().getProgressTextProps(), props))
</script>

<UI as="div" {...mergedProps}>
  {#if props.children}
    {@render props.children()}
  {:else}
    {tour().getProgressText()}
  {/if}
</UI>
