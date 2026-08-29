<script module lang="ts">
  export interface WithFieldProps {
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    required?: boolean
  }
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { Combobox, createListCollection } from '../index'

  const props: WithFieldProps = $props()
  const collection = createListCollection({ items: ['React', 'Solid', 'Vue'] })
</script>

<Field.Root {...props}>
  <Combobox.Root {collection} disabled={props.disabled} readOnly={props.readOnly}>
    <Combobox.Label>Label</Combobox.Label>
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
  </Combobox.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
