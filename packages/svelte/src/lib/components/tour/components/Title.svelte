<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourTitleBaseProps extends PolymorphicProps<'h2'> {}
  export interface TourTitleProps extends Assign<HTMLProps<'h2'>, TourTitleBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourTitleProps = $props()

  const tour = useTourContext()

  const mergedProps = $derived(mergeProps(tour().getTitleProps(), props))
</script>

<UI as="h2" {...mergedProps}>
  {#if props.children}
    {@render props.children()}
  {:else}
    {tour().step?.title}
  {/if}
</UI>
