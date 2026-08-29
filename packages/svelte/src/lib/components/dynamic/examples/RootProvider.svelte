<script lang="ts">
  import { Dynamic, useDynamic } from '../index'

  const id = $props.id()
  const dynamic = useDynamic({ id })
</script>

<button type="button" onclick={() => dynamic().focus()}>Focus</button>
<Dynamic.RootProvider value={dynamic}>
  <Dynamic.Context>
    {#snippet render(api)}
      <Dynamic.Label>Frameworks</Dynamic.Label>
      <Dynamic.Control>
        {#each api().value as value, index (`${value}-${index}`)}
          <Dynamic.Item {index} {value}><Dynamic.ItemPreview><Dynamic.ItemText>{value}</Dynamic.ItemText><Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger></Dynamic.ItemPreview><Dynamic.ItemInput /></Dynamic.Item>
        {/each}
        <Dynamic.Input placeholder="Add Framework" />
        <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
      </Dynamic.Control>
    {/snippet}
  </Dynamic.Context>
  <Dynamic.HiddenInput />
</Dynamic.RootProvider>
