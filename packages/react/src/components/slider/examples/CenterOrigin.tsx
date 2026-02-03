import { useState } from 'react'
import { Slider } from '../index'

export function CenterOrigin() {
  const [value, setValue] = useState([0])

  return (
    <Slider.Root
      origin="center"
      value={value}
      onValueChange={({ value }) => setValue(value)}
    >
      <Slider.Label>Center Origin</Slider.Label>
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
