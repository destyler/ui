<script lang="ts">
  import { Tabs } from '../index'

  let orientation = $state<'horizontal' | 'vertical'>('horizontal')
  const items = [
    { value: 'React' },
    { value: 'Solid' },
    { value: 'Vue' },
  ]
</script>

<Tabs.Root defaultValue="React" {orientation}>
  <Tabs.List>
    {#each items as item}
      <Tabs.Trigger value={item.value}>{item.value} Trigger</Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#each items as item}
    <Tabs.Content value={item.value}>{item.value} Content</Tabs.Content>
  {/each}
</Tabs.Root>
<button type="button" onclick={() => (orientation = 'vertical')}>vertical</button>
