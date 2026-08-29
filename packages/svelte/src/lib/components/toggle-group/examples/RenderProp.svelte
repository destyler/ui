<script lang="ts">
  import { ToggleGroup } from '../index'
</script>

<ToggleGroup.Root>
  <ToggleGroup.Context>{#snippet render(api)}<span>Selected: {api().value.join(', ') || 'None'}</span>{/snippet}</ToggleGroup.Context>
  <ToggleGroup.Item value="a">A</ToggleGroup.Item><ToggleGroup.Item value="b">B</ToggleGroup.Item><ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.Root>
