<script lang="ts">
  import { ToggleGroup, useToggleGroup } from '../index'
  const id = $props.id()
  const toggleGroup = useToggleGroup({ id })
</script>

<span>{toggleGroup().value.join(', ')}</span>
<ToggleGroup.RootProvider value={toggleGroup}>
  <ToggleGroup.Item value="a">A</ToggleGroup.Item><ToggleGroup.Item value="b">B</ToggleGroup.Item><ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.RootProvider>
