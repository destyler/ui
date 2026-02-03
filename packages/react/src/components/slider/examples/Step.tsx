import { useState } from 'react'
import { Slider } from '../index'

export function Step() {
  const [value, setValue] = useState([7])

  return (
    <Slider.Root
      min={5}
      max={10}
      step={0.01}
      value={value}
      onValueChange={({ value }) => setValue(value)}
    >
      <Slider.Label>Step (0.01)</Slider.Label>
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
