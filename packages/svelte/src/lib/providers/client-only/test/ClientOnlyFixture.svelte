<script lang="ts">
  import { ClientOnly } from '../index'
</script>

{#snippet fallback()}
  <p data-testid="fallback-slot">Fallback content</p>
{/snippet}

<ClientOnly {fallback}>
  <p data-testid="client-slot">Client content</p>
</ClientOnly>
