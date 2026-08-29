<script module lang="ts">
  import type { SliderRootProps } from '../index'

  export interface OnEventProps {
    onValueChange?: SliderRootProps['onValueChange']
    onValueChangeEnd?: SliderRootProps['onValueChangeEnd']
  }
</script>

<script lang="ts">
  import { Slider } from '../index'

  let value = $state([50])
  const {
    onValueChange = details => console.log('Value changed:', details.value),
    onValueChangeEnd = details => console.log('Value change ended:', details.value),
  }: OnEventProps = $props()
</script>

<Slider.Root bind:value {onValueChange} {onValueChangeEnd}>
  <Slider.Label>Event Handling</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>
