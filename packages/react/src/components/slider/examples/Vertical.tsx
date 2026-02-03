import { useState } from 'react'
import { Slider } from '../index'

export function Vertical() {
  const [value, setValue] = useState([50])

  return (
    <Slider.Root
      orientation="vertical"
      value={value}
      onValueChange={({ value }) => setValue(value)}
      style={{ height: '200px' }}
    >
      <Slider.Label>Vertical Slider</Slider.Label>
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
