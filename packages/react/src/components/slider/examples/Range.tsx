import { useState } from 'react'
import { Slider } from '../index'

export function Range() {
  const [values, setValues] = useState([10, 20])

  return (
    <Slider.Root
      defaultValue={[10, 20]}
      value={values}
      onValueChange={({ value }) => setValues(value)}
    >
      <Slider.Label>Range Slider</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.HiddenInput />
        </Slider.Thumb>
        <Slider.Thumb index={1}>
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  )
}
