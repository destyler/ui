<script module lang="ts">
  import type { ColorPickerRootProps } from '../index'

  export interface BasicProps extends Omit<ColorPickerRootProps, 'value'> {}
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { ColorPicker, parseColor } from '../index'

  const { defaultValue, ...props }: BasicProps = $props()
  let value = $state(untrack(() => defaultValue ?? parseColor('#eb5e41')))
</script>

<ColorPicker.Root bind:value {...props}>
  <ColorPicker.Label>Color</ColorPicker.Label>
  <ColorPicker.Control>
    <ColorPicker.ChannelInput channel="hex" />
    <ColorPicker.ChannelInput channel="alpha" />
    <ColorPicker.ValueText />
    <ColorPicker.Trigger data-testid="trigger">
      <ColorPicker.TransparencyGrid />
      <ColorPicker.Context>
        {#snippet render(colorPicker)}
          <ColorPicker.Swatch value={colorPicker().value} data-testid="swatch-trigger" />
        {/snippet}
      </ColorPicker.Context>
    </ColorPicker.Trigger>
  </ColorPicker.Control>
  <ColorPicker.Positioner data-testid="positioner">
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
        <ColorPicker.ChannelSliderLabel>Alpha</ColorPicker.ChannelSliderLabel>
        <ColorPicker.ChannelSliderValueText />
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
</ColorPicker.Root>
