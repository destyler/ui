import { useState } from 'react'
import { Slider } from '../index'

export function Basic() {
  const [sliderValue, setSliderValue] = useState([-20, 20])

  return (
    <Slider.Root
      min={-50}
      max={50}
      value={sliderValue}
      onValueChange={({ value }) => setSliderValue(value)}
    >
      <Slider.Label>Slider Label</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        {sliderValue.map((_, index) => (
          <Slider.Thumb key={index} index={index}>
            <Slider.DraggingIndicator />
            <Slider.HiddenInput />
          </Slider.Thumb>
        ))}
      </Slider.Control>
      <Slider.MarkerGroup>
        <Slider.Marker value={-30}>*</Slider.Marker>
        <Slider.Marker value={0}>*</Slider.Marker>
        <Slider.Marker value={30}>*</Slider.Marker>
      </Slider.MarkerGroup>
    </Slider.Root>
  )
}
