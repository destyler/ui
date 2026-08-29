<script module lang="ts">
  export interface WithFieldProps {
    invalid?: boolean
  }
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { Dynamic } from '../index'

  const { invalid = false }: WithFieldProps = $props()
  let values = $state<string[]>([])
</script>

<Field.Root {invalid}>
  <Dynamic.Root bind:value={values}>
    <Dynamic.Label>Label</Dynamic.Label>
    <Dynamic.Control>
      {#each values as value, index (`${value}-${index}`)}
        <Dynamic.Item {index} {value}><Dynamic.ItemPreview><Dynamic.ItemText>{value}</Dynamic.ItemText><Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger></Dynamic.ItemPreview><Dynamic.ItemInput /></Dynamic.Item>
      {/each}
      <Dynamic.Input placeholder="Add Framework" />
      <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
    </Dynamic.Control>
    <Dynamic.HiddenInput />
  </Dynamic.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
