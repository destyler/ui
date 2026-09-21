<script lang="ts">
  import { Collapsible } from '../index'

  let open = $state(false)
</script>

<button type="button" onclick={() => open = true}>Open</button>
<Collapsible.Root bind:open>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Content</Collapsible.Content>
</Collapsible.Root>
