<script lang="ts">
  import { ClientOnly } from '../index'
</script>

{#snippet fallback()}
  <p>Waiting for the browser…</p>
{/snippet}

<ClientOnly {fallback}>
  <p>This content only renders in the browser.</p>
</ClientOnly>
