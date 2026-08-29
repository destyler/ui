<script lang="ts">
  import { Slider } from '../index'

  let value = $state([7])
</script>

<Slider.Root min={5} max={10} step={0.01} bind:value>
  <Slider.Label>Step (0.01)</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>
