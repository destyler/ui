<script lang="ts">
  import { Slider } from '../index'

  let value = $state([0])
</script>

<Slider.Root min={-10} max={10} bind:value>
  <Slider.Label>Min/Max (-10 to 10)</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>
