<script lang="ts">import { Collapse } from '../index'; const items = ['React', 'Solid', 'Vue']</script>
<Collapse.Root>{#each items as item (item)}<Collapse.Item value={item} disabled={item === 'React'}><Collapse.ItemTrigger>{item} Trigger</Collapse.ItemTrigger><Collapse.ItemContent><div>{item} Content</div></Collapse.ItemContent></Collapse.Item>{/each}</Collapse.Root>
