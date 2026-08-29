<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourArrowBaseProps extends PolymorphicProps<'div'> {}
  export interface TourArrowProps extends Assign<HTMLProps<'div'>, TourArrowBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourArrowProps = $props()

  const tour = useTourContext()

  const mergedProps = $derived(mergeProps(tour().getArrowProps(), props))
</script>

{#if tour().step?.arrow}
  <UI as="div" {...mergedProps} />
{/if}
