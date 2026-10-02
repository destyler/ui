<script lang="ts">
  import type { ValueChangeDetails } from '@destyler/slider'
  import { Slider } from '../index'

  const { mode = 'accept', disabled = false, readOnly = false, onValueChange }: {
    mode?: 'accept' | 'veto' | 'delay'
    disabled?: boolean
    readOnly?: boolean
    onValueChange?: (details: ValueChangeDetails) => void
  } = $props()
  let value = $state([20, 80])
  let pending = $state<number[]>([])
  let swapped = $state(false)
  let renamed = $state(false)

  function change(details: ValueChangeDetails) {
    pending = details.value
    onValueChange?.(details)
    if (mode === 'accept') value = details.value
  }
</script>

<form data-testid="slider-form">
  <Slider.Root id="stage2-slider" {value} {disabled} {readOnly} thumbAlignment="center" onValueChange={change}>
    <Slider.Label>Range</Slider.Label>
    <Slider.ValueText data-testid="values" />
    <Slider.Control style="width:200px;height:20px">
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb data-testid="first-thumb" index={swapped ? 1 : 0} name={renamed ? 'renamed' : swapped ? 'high' : 'low'}>
        <Slider.HiddenInput />
        <Slider.DraggingIndicator />
      </Slider.Thumb>
      <Slider.Thumb data-testid="second-thumb" index={swapped ? 0 : 1} name={swapped ? 'low' : 'high'}>
        <Slider.HiddenInput />
        <Slider.DraggingIndicator />
      </Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
  <button type="button" onclick={() => { swapped = !swapped }}>Swap indices</button>
  <button type="button" onclick={() => { renamed = !renamed }}>Rename first</button>
  <button type="button" onclick={() => { value = pending }}>Accept pending</button>
</form>
