<script lang="ts">
  import { Radio } from '../index'

  const frameworks = ['React', 'Solid', 'Vue']
</script>

<Radio.Root defaultValue="Solid">
  <Radio.Label>Framework</Radio.Label>
  <Radio.Indicator />
  {#each frameworks as framework (framework)}
    <Radio.Item value={framework}>
      <Radio.ItemText>{framework}</Radio.ItemText>
      <Radio.ItemControl />
      <Radio.ItemHiddenInput />
    </Radio.Item>
  {/each}
</Radio.Root>
