<script lang="ts">
  import { Collapse, useCollapse } from '../index'
  const items = ['React', 'Solid', 'Vue']
  const id = $props.id()
  const collapse = useCollapse({ id, defaultValue: ['React'] })
</script>
<button onclick={() => collapse().setValue(['Vue'])}>Set to Vue</button><Collapse.RootProvider value={collapse}>{#each items as item (item)}<Collapse.Item value={item}><Collapse.ItemTrigger>What is {item}? <Collapse.ItemIndicator>x</Collapse.ItemIndicator></Collapse.ItemTrigger><Collapse.ItemContent><div>{item} is a JavaScript library for building user interfaces.</div></Collapse.ItemContent></Collapse.Item>{/each}</Collapse.RootProvider>
