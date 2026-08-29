<script lang="ts">
  import { portal } from '$lib'
  import { Select, createListCollection, useSelect } from '../index'

  const collection = createListCollection({ items: ['React', 'Solid', 'Vue'] })
  const id = $props.id()
  const select = useSelect({ collection, id })
</script>

<button type="button" onclick={() => select().focus()}>Focus</button>

<Select.RootProvider value={select}>
  <Select.Label>Framework</Select.Label>
  <Select.Control>
    <Select.Trigger>
      <Select.ValueText placeholder="Select a Framework" />
      <Select.Indicator>🔽</Select.Indicator>
    </Select.Trigger>
    <Select.ClearTrigger>Clear</Select.ClearTrigger>
  </Select.Control>
  <div use:portal>
    <Select.Positioner>
      <Select.Content>
        <Select.ItemGroup>
          <Select.ItemGroupLabel>Frameworks</Select.ItemGroupLabel>
          {#each collection.items as item (item)}
            <Select.Item {item}>
              <Select.ItemText>{item}</Select.ItemText>
              <Select.ItemIndicator>✓</Select.ItemIndicator>
            </Select.Item>
          {/each}
        </Select.ItemGroup>
      </Select.Content>
    </Select.Positioner>
  </div>
  <Select.HiddenSelect />
</Select.RootProvider>
