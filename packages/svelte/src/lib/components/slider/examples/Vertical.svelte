<script lang="ts">
  import { Slider } from '../index'

  let value = $state([50])
</script>

<Slider.Root orientation="vertical" style="height: 200px" bind:value>
  <Slider.Label>Vertical Slider</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>
