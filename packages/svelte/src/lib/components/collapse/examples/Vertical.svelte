<script lang="ts">import { Collapse } from '../index'; const items = ['React', 'Solid', 'Vue']</script>
<Collapse.Root orientation="vertical">{#each items as item (item)}<Collapse.Item value={item}><Collapse.ItemTrigger>{item} trigger</Collapse.ItemTrigger><Collapse.ItemContent><div>{item} content</div></Collapse.ItemContent></Collapse.Item>{/each}</Collapse.Root>
