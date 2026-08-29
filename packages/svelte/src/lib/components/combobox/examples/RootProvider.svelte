<script lang="ts">
  import { Combobox, createListCollection, useCombobox } from '../index'

  const initialItems = ['React', 'Solid', 'Vue']
  let items = $state(initialItems)
  const collection = $derived(createListCollection({ items }))
  const id = $props.id()
  const combobox = useCombobox(() => ({
    collection,
    id,
    onInputValueChange({ inputValue }) {
      items = initialItems.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
    },
  }))
</script>

<button type="button" onclick={() => combobox().focus()}>Focus</button>
<Combobox.RootProvider value={combobox}>
  <Combobox.Label>Framework</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input />
    <Combobox.Trigger>Open</Combobox.Trigger>
    <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
  </Combobox.Control>
  <Combobox.Positioner>
    <Combobox.Content>
      <Combobox.ItemGroup>
        <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
        {#each collection.items as item (item)}
          <Combobox.Item {item}>
            <Combobox.ItemText>{item}</Combobox.ItemText>
            <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
          </Combobox.Item>
        {/each}
      </Combobox.ItemGroup>
      <Combobox.List />
    </Combobox.Content>
  </Combobox.Positioner>
</Combobox.RootProvider>
