<script lang="ts">import { Popover } from '../index'</script>
<Popover.Root>
  <Popover.Trigger>
    {#snippet asChild(props)}<button {...props()}>Open</button>{/snippet}
  </Popover.Trigger>
</Popover.Root>
