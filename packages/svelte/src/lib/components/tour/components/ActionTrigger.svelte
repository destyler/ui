<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { StepActionTriggerProps } from '@destyler/tour'

  export interface TourActionTriggerBaseProps extends StepActionTriggerProps, PolymorphicProps<'button'> {}
  export interface TourActionTriggerProps extends Assign<HTMLProps<'button'>, TourActionTriggerBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTourContext } from '../hooks/use-tour-context'

  const props: TourActionTriggerProps = $props()
  const [actionTriggerProps, localProps] = $derived(
    createSplitProps<StepActionTriggerProps>()(props, ['action']),
  )

  const tour = useTourContext()

  const mergedProps = $derived(mergeProps(tour().getActionTriggerProps(actionTriggerProps), localProps))
</script>

<UI as="button" {...mergedProps}>
  {#if localProps.children}
    {@render localProps.children()}
  {:else}
    {actionTriggerProps.action.label}
  {/if}
</UI>
