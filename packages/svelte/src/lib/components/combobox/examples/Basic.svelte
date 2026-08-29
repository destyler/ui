<script module lang="ts">
  import type { ComboboxOpenChangeDetails, ComboboxValueChangeDetails } from '../index'

  export interface BasicProps {
    disabled?: boolean
    multiple?: boolean
    onValueChange?: (details: ComboboxValueChangeDetails) => void
    onOpenChange?: (details: ComboboxOpenChangeDetails) => void
    readOnly?: boolean
    lazyMount?: boolean
    unmountOnExit?: boolean
  }
</script>

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

  let { onOpenChange, onValueChange, ...props }: BasicProps = $props()
  let value = $state<string[]>([])
</script>

<Combobox.Root {collection} bind:value {onOpenChange} {onValueChange} {...props}>
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
