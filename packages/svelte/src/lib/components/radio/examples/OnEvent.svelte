<script module lang="ts">
  import type { UseRadioProps } from '../index'

  export interface OnEventProps {
    onValueChange?: UseRadioProps['onValueChange']
  }
</script>

<script lang="ts">
  import { Radio } from '../index'

  const props: OnEventProps = $props()
  const frameworks = ['React', 'Solid', 'Vue']
</script>

<Radio.Root onValueChange={props.onValueChange}>
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
