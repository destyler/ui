<script lang="ts">
  import { Collapse } from '../index'
  const items = ['React', 'Solid', 'Vue']
  let value = $state(['Vue'])
</script>
<div>{value.join(', ')}</div>
<Collapse.Root bind:value>
  {#each items as item (item)}
    <Collapse.Item value={item}>
      <Collapse.ItemTrigger>{item} trigger</Collapse.ItemTrigger>
      <Collapse.ItemContent>{item} content</Collapse.ItemContent>
    </Collapse.Item>
  {/each}
</Collapse.Root>
