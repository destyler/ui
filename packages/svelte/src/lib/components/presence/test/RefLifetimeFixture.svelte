<script lang="ts">
  import type { PropsFn } from '$lib/types'
  import { untrack } from 'svelte'
  import Presence from '../components/Presence.svelte'

  let { initiallyPresent = true, unmountOnExit = false, child = false, bound = true } = $props<{
    initiallyPresent?: boolean
    unmountOnExit?: boolean
    child?: boolean
    bound?: boolean
  }>()
  let shown = $state(true)
  let present = $state(untrack(() => initiallyPresent))
  let node = $state<Element | null>(null)
  let generation = $state(0)
  let ownerGeneration = $state(0)

  export const currentRef = () => node
  export const hide = () => { shown = false }
  export const close = () => { present = false }
  export const show = () => { shown = true }
  export const open = () => { present = true }
  export const replaceRef = (value: Element) => { node = value }
  export const replaceOwner = () => { ownerGeneration += 1 }
  export const replaceNode = () => { generation += 1 }
</script>

{#snippet childNode(props: PropsFn<'div'>)}
  {#key generation}
    <div {...props()} data-testid="presence-ref" data-generation={generation}></div>
  {/key}
{/snippet}

{#if shown}
  {#key ownerGeneration}
    {#if bound}
      <Presence {present} immediate {unmountOnExit} asChild={child ? childNode : undefined} bind:ref={node} data-testid="presence-ref" />
    {:else}
      <Presence {present} immediate {unmountOnExit} asChild={child ? childNode : undefined} data-testid="presence-ref" />
    {/if}
  {/key}
{/if}
