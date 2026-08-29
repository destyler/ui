<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface TourSpotlightBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface TourSpotlightProps extends Assign<HTMLProps<'div'>, TourSpotlightBaseProps> {}
</script>

<script lang="ts">
  import { useRenderStrategyPropsContext } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresence } from '../../presence'
  import { useTourContext } from '../hooks/use-tour-context'

  let { ref = $bindable(), ...props }: TourSpotlightProps = $props()

  const tour = useTourContext()
  const renderStrategyProps = useRenderStrategyPropsContext()

  const presence = usePresence(() => ({
    present: tour().open,
    ...renderStrategyProps(),
  }))

  const mergedProps = $derived(mergeProps(tour().getSpotlightProps(), presence().getPresenceProps(), props))
  const hidden = $derived(!tour().open || !tour().step?.target?.())

  function setNode(node: Element | null) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} {hidden} />
{/if}
