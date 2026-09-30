<script setup lang="ts">
import { ColorPicker, parseColor } from '../index'
</script>

<template>
  <ColorPicker.Root format="hsla" :default-value="parseColor('hsl(210, 100%, 50%)')">
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
          <ColorPicker.SwatchTrigger value="red">
            <ColorPicker.Swatch value="red">
              <ColorPicker.SwatchIndicator>✓</ColorPicker.SwatchIndicator>
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
          <ColorPicker.SwatchTrigger value="blue">
            <ColorPicker.Swatch value="blue">
              <ColorPicker.SwatchIndicator>✓</ColorPicker.SwatchIndicator>
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
          <ColorPicker.SwatchTrigger value="green">
            <ColorPicker.Swatch value="green">
              <ColorPicker.SwatchIndicator>✓</ColorPicker.SwatchIndicator>
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
        </ColorPicker.SwatchGroup>
      </ColorPicker.Content>
    </ColorPicker.Positioner>
  </ColorPicker.Root>
</template>
