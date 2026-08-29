<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface TourBackdropBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface TourBackdropProps extends Assign<HTMLProps<'div'>, TourBackdropBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresence } from '../../presence'
  import { useTourContext } from '../hooks/use-tour-context'
  import { useRenderStrategyPropsContext } from '$lib/utils/render-strategy'

  let { ref = $bindable(), ...props }: TourBackdropProps = $props()
  const renderStrategyProps = useRenderStrategyPropsContext()

  const tour = useTourContext()
  const presence = usePresence(() => ({
    ...renderStrategyProps(),
    present: tour().open,
  }))

  const mergedProps = $derived(mergeProps(tour().getBackdropProps(), presence().getPresenceProps(), props))

  function setNode(node: Element | null) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} hidden={!tour().step?.backdrop} />
{/if}
