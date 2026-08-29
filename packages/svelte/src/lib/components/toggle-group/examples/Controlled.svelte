<script lang="ts">
  import { ToggleGroup } from '../index'
  let value = $state(['a'])
</script>

<ToggleGroup.Root bind:value>
  <ToggleGroup.Item value="a">A</ToggleGroup.Item><ToggleGroup.Item value="b">B</ToggleGroup.Item><ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.Root>
