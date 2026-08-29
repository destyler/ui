<script lang="ts">
  import { Slider } from '../index'

  let value = $state([10, 20])
</script>

<Slider.Root bind:value>
  <Slider.Label>Range Slider</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
    <Slider.Thumb index={1}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>
