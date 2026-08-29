<script lang="ts">
  import { Radio, useRadio } from '../index'

  const id = $props.id()
  const radio = useRadio({ id })
  const frameworks = ['React', 'Solid', 'Vue']
</script>

<button type="button" onclick={() => radio().focus()}>Focus</button>

<Radio.RootProvider value={radio}>
  <Radio.Label>Framework</Radio.Label>
  <Radio.Indicator />
  {#each frameworks as framework (framework)}
    <Radio.Item value={framework}>
      <Radio.ItemText>{framework}</Radio.ItemText>
      <Radio.ItemControl />
      <Radio.ItemHiddenInput />
    </Radio.Item>
  {/each}
</Radio.RootProvider>
