<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourArrowTipBaseProps extends PolymorphicProps<'div'> {}
  export interface TourArrowTipProps extends Assign<HTMLProps<'div'>, TourArrowTipBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourArrowTipProps = $props()

  const tour = useTourContext()
  const mergedProps = $derived(mergeProps(tour().getArrowTipProps(), props))
</script>

<UI as="div" {...mergedProps} />
