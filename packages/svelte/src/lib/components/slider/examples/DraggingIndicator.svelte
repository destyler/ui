<script lang="ts">
  import { Slider } from '../index'

  let value = $state([50])
</script>

<Slider.Root bind:value>
  <Slider.Label>Dragging Indicator</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}>
      <Slider.DraggingIndicator />
      <Slider.HiddenInput />
    </Slider.Thumb>
  </Slider.Control>
</Slider.Root>
