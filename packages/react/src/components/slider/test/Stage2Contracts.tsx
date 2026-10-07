import type { ValueChangeDetails } from '@destyler/slider'
import { useState } from 'react'
import { Slider } from '../index'

export function Stage2Contracts(props: { mode?: 'accept' | 'veto' | 'delay', onValueChange?: (details: ValueChangeDetails) => void }) {
  const [value, setValue] = useState([20, 80])
  const [pending, setPending] = useState<number[]>([])
  function change(details: ValueChangeDetails) {
    setPending(details.value)
    props.onValueChange?.(details)
    if ((props.mode ?? 'accept') === 'accept')
      setValue(details.value)
  }
  return (
    <form data-testid="slider-form">
      <Slider.Root id="stage2-slider" value={value} onValueChange={change} thumbAlignment="center">
        <Slider.Label>Range</Slider.Label>
        <Slider.ValueText data-testid="values" />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb index={0} name="low"><Slider.HiddenInput /></Slider.Thumb>
          <Slider.Thumb index={1} name="high"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <button type="button" onClick={() => setValue(pending)}>Accept pending</button>
    </form>
  )
}
