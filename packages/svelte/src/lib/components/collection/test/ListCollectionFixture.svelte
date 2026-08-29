<script lang="ts">
  import { useListCollection } from '../index'

  const initialItems = [
    { label: 'Alpha', value: 'a' },
    { label: 'Beta', value: 'b' },
    { label: 'Charlie', value: 'c' },
    { label: 'Delta', value: 'd' },
  ]

  const list = useListCollection({
    initialItems,
    itemToString: item => item.label,
    itemToValue: item => item.value,
    filter: (itemText, filterText) => itemText.toLowerCase().includes(filterText.toLowerCase()),
  })
</script>

<output data-testid="items">{list.collection().items.map(item => item.value).join(',')}</output>
<button type="button" onclick={() => list.remove(initialItems[1]!)}>Remove beta</button>
<button type="button" onclick={() => list.filter('alpha')}>Filter alpha</button>
<button type="button" onclick={() => list.filter('')}>Clear filter</button>
<button type="button" onclick={() => list.moveBefore('a', 'c')}>Move alpha before charlie</button>
<button type="button" onclick={() => list.moveAfter('a', 'c')}>Move alpha after charlie</button>
<button type="button" onclick={() => list.moveAfter('b', 'b')}>Move beta after itself</button>
<button type="button" onclick={() => list.reset()}>Reset</button>
