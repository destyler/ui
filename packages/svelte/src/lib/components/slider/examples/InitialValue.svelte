<script lang="ts">
  import { Slider } from '../index'

  let value = $state([42])
</script>

<Slider.Root bind:value>
  <Slider.Label>Slider with Initial Value</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
  <Slider.MarkerGroup>
    <Slider.Marker value={0}>0</Slider.Marker>
    <Slider.Marker value={30}>30</Slider.Marker>
    <Slider.Marker value={60}>60</Slider.Marker>
  </Slider.MarkerGroup>
</Slider.Root>
