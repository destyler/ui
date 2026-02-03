import { useState } from 'react'
import { Slider } from '../index'

export function OnEvent() {
  const [value, setValue] = useState([50])

  return (
    <Slider.Root
      value={value}
      onValueChange={({ value }) => {
        setValue(value)
        // eslint-disable-next-line no-console
        console.log('Value changed:', value)
      }}
      onValueChangeEnd={({ value }) => {
        // eslint-disable-next-line no-console
        console.log('Value change ended:', value)
      }}
    >
      <Slider.Label>Event Handling</Slider.Label>
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
