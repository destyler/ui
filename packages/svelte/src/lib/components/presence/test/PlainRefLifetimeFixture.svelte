<script lang="ts">
  let node = $state<Element | null>(null)
  let shown = $state(true)

  export const currentRef = () => node
  export const replaceRef = (value: Element) => { node = value }
  export const hide = () => { shown = false }
</script>

{#if shown}
  <div bind:this={node} data-testid="plain-ref"></div>
{/if}
