<script lang="ts">
  import { ColorPicker, useColorPicker } from '../index'

  const id = $props.id()
  const colorPicker = useColorPicker({ id })
</script>

<span>Color: {colorPicker().valueAsString}</span>

<ColorPicker.RootProvider value={colorPicker}>
  <ColorPicker.Label>Color</ColorPicker.Label>
  <ColorPicker.Control>
    <ColorPicker.ChannelInput channel="hex" />
    <ColorPicker.ChannelInput channel="alpha" />
    <ColorPicker.ValueText />
    <ColorPicker.Trigger>
      <ColorPicker.TransparencyGrid />
      <ColorPicker.ValueSwatch />
    </ColorPicker.Trigger>
  </ColorPicker.Control>
  <ColorPicker.Positioner>
    <ColorPicker.Content>
      <ColorPicker.FormatTrigger>Toggle ColorFormat</ColorPicker.FormatTrigger>
      <ColorPicker.FormatSelect />
      <ColorPicker.Area>
        <ColorPicker.AreaBackground />
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>
      <ColorPicker.ChannelSlider channel="hue">
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>
      <ColorPicker.ChannelSlider channel="alpha">
        <ColorPicker.TransparencyGrid />
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>
      <ColorPicker.SwatchGroup>
        {#each ['red', 'blue', 'green'] as swatch (swatch)}
          <ColorPicker.SwatchTrigger value={swatch}>
            <ColorPicker.Swatch value={swatch}>
              <ColorPicker.SwatchIndicator>✓</ColorPicker.SwatchIndicator>
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
        {/each}
      </ColorPicker.SwatchGroup>
      <ColorPicker.View format="rgba">
        <ColorPicker.ChannelInput channel="hex" />
        <ColorPicker.ChannelInput channel="alpha" />
      </ColorPicker.View>
      <ColorPicker.View format="hsla">
        <ColorPicker.ChannelInput channel="hue" />
        <ColorPicker.ChannelInput channel="saturation" />
        <ColorPicker.ChannelInput channel="lightness" />
      </ColorPicker.View>
      <ColorPicker.EyeDropperTrigger>Pick color</ColorPicker.EyeDropperTrigger>
    </ColorPicker.Content>
  </ColorPicker.Positioner>
  <ColorPicker.HiddenInput />
</ColorPicker.RootProvider>
