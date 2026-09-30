<script lang="ts">
  import { ColorPicker, parseColor } from '../index'
</script>

<ColorPicker.Root defaultValue={parseColor('#3b82f6')}>
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
    </ColorPicker.Content>
  </ColorPicker.Positioner>
</ColorPicker.Root>
