<script lang="ts">
  import { Dynamic } from '../index'

  let values = $state<string[]>([])
</script>

<Dynamic.Root
  bind:value={values}
  onValueChange={details => console.log(details)}
  onHighlightChange={details => console.log(details)}
  onValueInvalid={details => console.log(details)}
>
  <Dynamic.Label>Frameworks</Dynamic.Label>
  <Dynamic.Control>
    {#each values as value, index (`${value}-${index}`)}
      <Dynamic.Item {index} {value}><Dynamic.ItemInput /><Dynamic.ItemText>{value}</Dynamic.ItemText><Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger></Dynamic.Item>
    {/each}
    <Dynamic.Input placeholder="Add Framework" />
    <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
  </Dynamic.Control>
  <Dynamic.HiddenInput />
</Dynamic.Root>
