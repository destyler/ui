import { useRef, useState } from 'react'
import { Slider, useSlider } from '../index'

export function RootProviderExample() {
  const [value, setValue] = useState([50])
  const slider = useSlider({
    value,
    onValueChange: ({ value }) => setValue(value),
  })
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={() => slider.focus()}
        style={{ marginBottom: '16px' }}
      >
        Focus Slider
      </button>
      <Slider.RootProvider value={slider}>
        <Slider.Label>Root Provider Example</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.HiddenInput />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.RootProvider>
    </div>
  )
}
