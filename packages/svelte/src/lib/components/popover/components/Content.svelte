<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverContentBaseProps extends PolymorphicProps<'div'> {
    ref?: Element | null
  }
  export interface PopoverContentProps extends Assign<HTMLProps<'div'>, PopoverContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { usePopoverContext } from '../hooks/use-popover-context'

  let { ref = $bindable<Element | null>(), ...props }: PopoverContentProps = $props()

  const popover = usePopoverContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(popover().getContentProps(), presence().getPresenceProps(), props))

  function setNode(node: Element | null) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} />
{/if}
