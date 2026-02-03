import { useState } from 'react'
import { Slider } from '../index'

export function WithMarks() {
  const [value, setValue] = useState([50])

  return (
    <Slider.Root
      value={value}
      onValueChange={({ value }) => setValue(value)}
    >
      <Slider.Label>With Marks</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
      <Slider.MarkerGroup>
        <Slider.Marker value={0}>0</Slider.Marker>
        <Slider.Marker value={25}>*</Slider.Marker>
        <Slider.Marker value={50}>50</Slider.Marker>
        <Slider.Marker value={75}>*</Slider.Marker>
      </Slider.MarkerGroup>
    </Slider.Root>
  )
}
