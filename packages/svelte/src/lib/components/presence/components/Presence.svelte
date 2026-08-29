<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { type UsePresenceProps, usePresence } from '../hooks/use-presence.svelte'

  export interface PresenceBaseProps extends UsePresenceProps, PolymorphicProps<'div'> {
    ref?: Element | null
  }
  export interface PresenceProps extends Assign<HTMLProps<'div'>, PresenceBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { splitPresenceProps } from '../hooks/split-presence-props.svelte'

  let { ref = $bindable<Element | null>(null), ...props }: PresenceProps = $props()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))
  const presence = usePresence(() => presenceProps)

  const mergedProps = $derived(mergeProps(presence().getPresenceProps(), localProps))
  let localNode: Element | null = $state(null)

  $effect(() => {
    const node = localNode
    untrack(() => {
      ref = node
      presence().setNode(node)
    })
  })
</script>

{#if !presence().unmounted}
  <UI as="div" data-scope="presence" data-part="root" bind:ref={localNode} {...mergedProps} />
{/if}
