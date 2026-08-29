<script lang="ts">
  import { Select, createListCollection } from '../index'

  const collection = createListCollection({
    items: [
      { label: 'Svelte', value: 'svelte' },
      { label: 'Solid', value: 'solid' },
      { disabled: true, label: 'Disabled', value: 'disabled' },
    ],
    itemToString: item => item.label,
    itemToValue: item => item.value,
    isItemDisabled: item => Boolean(item.disabled),
  })
</script>

<form data-testid="form">
  <Select.Root {collection} name="framework">
    <Select.HiddenSelect data-testid="select" />
  </Select.Root>
</form>
