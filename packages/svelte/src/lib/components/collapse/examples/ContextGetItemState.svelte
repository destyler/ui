<script lang="ts">
  import { Collapse } from '../index'
  const items = [{ value: 'React' }, { value: 'Solid', disabled: true }, { value: 'Vue' }]
</script>
<Collapse.Root defaultValue={['React']}>
  <Collapse.Context>{#snippet render(context)}
    <b>Vue State:</b><span>Disabled: {context().getItemState(items[2]).disabled ? 'Y' : 'N'}</span><span>Expanded: {context().getItemState(items[2]).expanded ? 'Y' : 'N'}</span><span>Focused: {context().getItemState(items[2]).focused ? 'Y' : 'N'}</span>
  {/snippet}</Collapse.Context>
  {#each items as item (item.value)}<Collapse.Item {...item}><Collapse.ItemTrigger>What is {item.value}? <Collapse.ItemIndicator>x</Collapse.ItemIndicator></Collapse.ItemTrigger><Collapse.ItemContent><div>{item.value} is a JavaScript library for building user interfaces.</div></Collapse.ItemContent></Collapse.Item>{/each}
</Collapse.Root>
