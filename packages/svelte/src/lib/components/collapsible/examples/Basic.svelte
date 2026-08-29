<script lang="ts">
  import type { CollapsibleRootProps } from '../index'
  import { Collapsible } from '../index'
  const props: CollapsibleRootProps = $props()
</script>
<Collapsible.Root {...props}>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Content</Collapsible.Content>
</Collapsible.Root>
