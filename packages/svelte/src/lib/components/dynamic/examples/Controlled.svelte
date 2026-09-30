<script lang="ts">
  import { Dynamic } from '../index'

  let value = $state(['react', 'solid', 'vue'])
</script>

<output>{value.join(', ')}</output>
<Dynamic.Root bind:value>
  <Dynamic.Label>Frameworks</Dynamic.Label>
  <Dynamic.Control>
    {#each value as item, index (`${item}-${index}`)}
      <Dynamic.Item {index} value={item}>
        <Dynamic.ItemPreview>
          <Dynamic.ItemText>{item}</Dynamic.ItemText>
          <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
        </Dynamic.ItemPreview>
        <Dynamic.ItemInput />
      </Dynamic.Item>
    {/each}
    <Dynamic.Input placeholder="Add tag" />
    <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
  </Dynamic.Control>
  <Dynamic.HiddenInput />
</Dynamic.Root>
