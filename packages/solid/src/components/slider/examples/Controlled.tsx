import { Slider } from '@destyler-ui/solid/slider'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal([42])

  return (
    <>
      <output>{value().join(', ')}</output>
      <Slider.Root value={value()} onValueChange={details => setValue(details.value)}>
        <Slider.Label>Label</Slider.Label>
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
          <Slider.Marker value={0}>*</Slider.Marker>
          <Slider.Marker value={30}>*</Slider.Marker>
          <Slider.Marker value={60}>*</Slider.Marker>
        </Slider.MarkerGroup>
      </Slider.Root>
    </>
  )
}
