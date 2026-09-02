import { Slider } from '@destyler-ui/solid/slider'

export function OnEvent() {
  return (
    <Slider.Root
      onValueChange={details => console.warn(details.value)}
      onValueChangeEnd={details => console.warn(details.value)}
    >
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
    </Slider.Root>
  )
}
