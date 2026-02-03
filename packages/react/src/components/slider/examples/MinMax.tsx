import { useState } from 'react'
import { Slider } from '../index'

export function MinMax() {
  const [value, setValue] = useState([0])

  return (
    <Slider.Root
      min={-10}
      max={10}
      value={value}
      onValueChange={({ value }) => setValue(value)}
    >
      <Slider.Label>Min/Max (-10 to 10)</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  )
}
