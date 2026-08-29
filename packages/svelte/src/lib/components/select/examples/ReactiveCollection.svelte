<script lang="ts">
  import { Select, createListCollection } from '../index'

  const items = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Svelte', value: 'svelte', disabled: true },
    { label: 'Vue', value: 'vue' },
  ]
  let number = $state(0)
  const collection = $derived(createListCollection({
    items: items.map((item) => ({ ...item, label: `${item.label}-${number}` })),
  }))
</script>

<div>
  <button type="button" onclick={() => number += 1}>Inc</button>
  <button type="button" onclick={() => number -= 1}>Dec</button>
  <Select.Root positioning={{ sameWidth: true }} {collection}>
    <Select.Label>Framework</Select.Label>
    <Select.Control>
      <Select.Trigger>
        <Select.ValueText placeholder="Select a Framework" />
      </Select.Trigger>
    </Select.Control>
    <Select.Positioner>
      <Select.Content>
        <Select.ItemGroup>
          <Select.ItemGroupLabel>Framework</Select.ItemGroupLabel>
          {#each collection.items as item (item.value)}
            <Select.Item {item}>
              <Select.ItemText>{item.label}</Select.ItemText>
              <Select.ItemIndicator>✅</Select.ItemIndicator>
            </Select.Item>
          {/each}
        </Select.ItemGroup>
      </Select.Content>
    </Select.Positioner>
  </Select.Root>
</div>
