<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourDescriptionBaseProps extends PolymorphicProps<'div'> {}
  export interface TourDescriptionProps extends Assign<HTMLProps<'div'>, TourDescriptionBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourDescriptionProps = $props()

  const tour = useTourContext()
  const mergedProps = $derived(mergeProps(tour().getDescriptionProps(), props))
</script>

<UI as="div" {...mergedProps}>
  {#if props.children}
    {@render props.children()}
  {:else}
    {tour().step?.description}
  {/if}
</UI>
