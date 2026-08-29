<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface TourContentBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface TourContentProps extends Assign<HTMLProps<'div'>, TourContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useTourContext } from '../hooks/use-tour-context'

  let { ref = $bindable(), ...props }: TourContentProps = $props()

  const tour = useTourContext()
  const presence = usePresenceContext()

  const mergedProps = $derived(mergeProps(tour().getContentProps(), presence().getPresenceProps(), props))

  function setNode(node: Element | null) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} />
{/if}
