<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface TourCloseTriggerProps extends Assign<HTMLProps<'button'>, TourCloseTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourCloseTriggerProps = $props()

  const tour = useTourContext()

  const mergedProps = $derived(mergeProps(tour().getCloseTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
