<script lang="ts">
  import { Dynamic } from '../index'
</script>

<Dynamic.Root defaultValue={['React', 'Solid', 'Vue']}>
  <Dynamic.Context>
    {#snippet render(api)}
      <Dynamic.Label>Frameworks</Dynamic.Label>
      <Dynamic.Control>
        {#each api().value as value, index (`${value}-${index}`)}
          <Dynamic.Item {index} {value}><Dynamic.ItemInput /><Dynamic.ItemText>{value}</Dynamic.ItemText><Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger></Dynamic.Item>
        {/each}
        <Dynamic.Input placeholder="Add Framework" />
        <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
      </Dynamic.Control>
    {/snippet}
  </Dynamic.Context>
  <Dynamic.HiddenInput />
</Dynamic.Root>
