<script module lang="ts">
  import type { SelectRootProps } from '../index'

  type Framework = { label: string, value: string, disabled?: boolean }
  export interface BasicProps extends Omit<SelectRootProps<Framework>, 'collection'> {}
</script>

<script lang="ts">
  import { Select, createListCollection } from '../index'

  const props: BasicProps = $props()
  const collection = createListCollection<Framework>({
    items: [
      { label: 'React', value: 'react' },
      { label: 'Solid', value: 'solid' },
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte', disabled: true },
    ],
  })
</script>

<Select.Root {collection} {...props}>
  <Select.Label>Framework</Select.Label>
  <Select.Control>
    <Select.Trigger>
      <Select.ValueText placeholder="Select a Framework" />
      <Select.Indicator>ChevronDownIcon</Select.Indicator>
    </Select.Trigger>
    <Select.ClearTrigger>Clear</Select.ClearTrigger>
  </Select.Control>
  <Select.Positioner data-testid="positioner">
    <Select.Content>
      <Select.ItemGroup>
        <Select.ItemGroupLabel>Frameworks</Select.ItemGroupLabel>
        {#each collection.items as item (item.value)}
          <Select.Item {item}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator>✓</Select.ItemIndicator>
          </Select.Item>
        {/each}
      </Select.ItemGroup>
      <Select.List />
    </Select.Content>
  </Select.Positioner>
  <Select.HiddenSelect />
</Select.Root>
