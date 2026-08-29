<script lang="ts">
  import { Slider } from '../index'

  let value = $state([0])
</script>

<Slider.Root origin="center" bind:value>
  <Slider.Label>Center Origin</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>
