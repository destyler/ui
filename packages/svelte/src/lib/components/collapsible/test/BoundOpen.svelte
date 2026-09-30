<script lang="ts">
  import { Collapsible } from '../index'

  let open = $state(true)
</script>

<output data-testid="bound-open">{String(open)}</output>
<Collapsible.Root bind:open>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Content</Collapsible.Content>
</Collapsible.Root>
