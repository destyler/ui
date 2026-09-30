<script lang="ts">
  import { Combobox, createListCollection } from '../index'

  const collection = createListCollection({
    items: [
      { label: 'React', value: 'react' },
      { label: 'Solid', value: 'solid' },
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte', disabled: true },
    ],
  })
</script>

<Combobox.Root {collection} defaultValue={["vue"]}>
  <Combobox.Label>Framework</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input data-testid="input" />
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
  </Combobox.Control>
  <Combobox.Positioner data-testid="positioner">
    <Combobox.Content>
      <Combobox.ItemGroup>
        <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
        {#each collection.items as item (item.value)}
          <Combobox.Item {item}>
            <Combobox.ItemText>{item.label}</Combobox.ItemText>
            <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
          </Combobox.Item>
        {/each}
      </Combobox.ItemGroup>
      <Combobox.List />
    </Combobox.Content>
  </Combobox.Positioner>
</Combobox.Root>
