<script lang="ts">
  import { Slider, useSlider } from '../index'

  let value = $state([50])
  const id = $props.id()
  const slider = useSlider(() => ({
    id,
    value,
    onValueChange(details) {
      value = details.value
    },
  }))
</script>

<div>
  <button type="button" onclick={() => slider().focus()} style="margin-bottom: 16px;">Focus Slider</button>
  <Slider.RootProvider value={slider}>
    <Slider.Label>Root Provider Example</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.RootProvider>
</div>
