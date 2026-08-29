<script lang="ts">
  import { Slider } from '../index'

  let value = $state([50])
</script>

<Slider.Root bind:value>
  <Slider.Label>With Marks</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
  <Slider.MarkerGroup>
    <Slider.Marker value={0}>0</Slider.Marker>
    <Slider.Marker value={25}>*</Slider.Marker>
    <Slider.Marker value={50}>50</Slider.Marker>
    <Slider.Marker value={75}>*</Slider.Marker>
  </Slider.MarkerGroup>
</Slider.Root>
