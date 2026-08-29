<script module lang="ts">
  export interface WithFieldProps {
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
  }
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { portal } from '$lib'
  import { Select, createListCollection } from '../index'

  const { disabled, readOnly, invalid }: WithFieldProps = $props()
  const collection = createListCollection({ items: ['React', 'Solid', 'Vue'] })
</script>

<Field.Root {disabled} {readOnly} {invalid}>
  <Select.Root {collection} {disabled} {readOnly}>
    <Select.Label>Label</Select.Label>
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
  </Select.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
