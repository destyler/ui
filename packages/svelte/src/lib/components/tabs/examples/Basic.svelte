<script lang="ts">
  import type { TabsRootProps } from '../index'
  import { Tabs } from '../index'
  const props: TabsRootProps = $props()
  const items = [
    { value: 'React' },
    { value: 'Solid' },
    { value: 'Svelte', disabled: true },
    { value: 'Vue' },
  ]
</script>
<Tabs.Root {...props}>
  <Tabs.List>
    {#each items as item (item.value)}<Tabs.Trigger value={item.value} disabled={item.disabled}>{item.value} Trigger</Tabs.Trigger>{/each}
    <Tabs.Indicator />
  </Tabs.List>
  {#each items as item (item.value)}<Tabs.Content value={item.value}>{item.value} Content</Tabs.Content>{/each}
</Tabs.Root>
