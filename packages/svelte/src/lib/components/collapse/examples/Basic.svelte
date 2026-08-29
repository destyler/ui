<script lang="ts">
  import type { CollapseRootProps } from '../index'
  import { Collapse } from '../index'
  const props: CollapseRootProps = $props()
  const items = [
    { value: 'React' },
    { value: 'Solid' },
    { value: 'Svelte', disabled: true },
    { value: 'Vue' },
  ]
</script>
<Collapse.Root {...props}>
  {#each items as item (item.value)}
    <Collapse.Item value={item.value} disabled={item.disabled}>
      <Collapse.ItemTrigger>{item.value} Trigger <Collapse.ItemIndicator>⬇️</Collapse.ItemIndicator></Collapse.ItemTrigger>
      <Collapse.ItemContent>{item.value} Content</Collapse.ItemContent>
    </Collapse.Item>
  {/each}
</Collapse.Root>
