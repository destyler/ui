<script module lang="ts">
  import type { SliderRootProps } from '../index'

  export interface BasicProps extends SliderRootProps {}
</script>

<script lang="ts">
  import { Slider } from '../index'

  let { value = $bindable([-20, 20]), min = -50, max = 50, ...props }: BasicProps = $props()
</script>

<Slider.Root {min} {max} bind:value {...props}>
  <Slider.Label>Slider Label</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    {#each value as _, index (index)}
      <Slider.Thumb {index}>
        <Slider.DraggingIndicator />
        <Slider.HiddenInput />
      </Slider.Thumb>
    {/each}
  </Slider.Control>
  <Slider.MarkerGroup>
    <Slider.Marker value={-30}>*</Slider.Marker>
    <Slider.Marker value={0}>*</Slider.Marker>
    <Slider.Marker value={30}>*</Slider.Marker>
  </Slider.MarkerGroup>
</Slider.Root>
