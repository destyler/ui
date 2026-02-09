import { useState } from 'react'
import { ColorPicker, parseColor } from '../index'

interface BasicProps {
  defaultValue?: ReturnType<typeof parseColor>
  lazyMount?: boolean
  unmountOnExit?: boolean
}

export function Basic({ defaultValue, lazyMount, unmountOnExit }: BasicProps = {}) {
  const [value, setValue] = useState(defaultValue ?? parseColor('#eb5e41'))

  return (
    <ColorPicker.Root
      value={value}
      onValueChange={details => setValue(details.value)}
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
    >
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.ChannelInput channel="hex" />
        <ColorPicker.ChannelInput channel="alpha" />
        <ColorPicker.ValueText />
        <ColorPicker.Trigger data-testid="trigger">
          <ColorPicker.TransparencyGrid />
          <ColorPicker.Context>
            {colorPicker => (
              <ColorPicker.Swatch value={colorPicker.value} data-testid="swatch-trigger" />
            )}
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
  )
}
