<script lang="ts">
  import { Radio } from '../index'

  let value = $state('vue')
  const items = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', disabled: true },
  ]
</script>

<output>{value}</output>
<Radio.Root bind:value>
  <Radio.Label>Framework</Radio.Label>
  <Radio.Indicator />
  {#each items as item (item.value)}
    <Radio.Item value={item.value} disabled={item.disabled}>
      <Radio.ItemText>{item.label}</Radio.ItemText>
      <Radio.ItemControl />
      <Radio.ItemHiddenInput />
    </Radio.Item>
  {/each}
</Radio.Root>
