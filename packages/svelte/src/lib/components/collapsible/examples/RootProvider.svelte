<script lang="ts">
  import { Collapsible, useCollapsible } from '../index'
  const id = $props.id()
  const collapsible = useCollapsible({ id })
</script>
<span>{collapsible().visible ? 'Visible' : 'Hidden'}</span>
<Collapsible.RootProvider value={collapsible}><Collapsible.Trigger>Toggle</Collapsible.Trigger><Collapsible.Content>Content</Collapsible.Content></Collapsible.RootProvider>
