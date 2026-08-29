<script lang="ts">
  import { Dynamic } from '../index'

  let values = $state(['react', 'solid', 'vue'])
</script>

<Dynamic.Root bind:value={values}>
  <Dynamic.Label>Frameworks</Dynamic.Label>
  <Dynamic.Control>
    {#each values as value, index (`${value}-${index}`)}
      <Dynamic.Item {index} {value}><Dynamic.ItemPreview><Dynamic.ItemText>{value}</Dynamic.ItemText><Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger></Dynamic.ItemPreview><Dynamic.ItemInput /></Dynamic.Item>
    {/each}
    <Dynamic.Input placeholder="Add tag" />
    <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
  </Dynamic.Control>
  <Dynamic.HiddenInput />
</Dynamic.Root>
