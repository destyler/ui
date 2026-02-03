import { useState } from 'react'
import { Slider } from '../index'

export function DraggingIndicator() {
  const [value, setValue] = useState([50])

  return (
    <Slider.Root
      value={value}
      onValueChange={({ value }) => setValue(value)}
    >
      <Slider.Label>Dragging Indicator</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.DraggingIndicator />
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  )
}
