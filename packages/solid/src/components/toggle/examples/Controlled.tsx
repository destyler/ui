import { Toggle } from '@destyler-ui/solid/toggle'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [pressed, setPressed] = createSignal(false)

  return (
    <>
      <output>{String(pressed())}</output>
      <Toggle.Root pressed={pressed} onPressedChange={setPressed}>
        <Toggle.Indicator>✓</Toggle.Indicator>
        Toggle
      </Toggle.Root>
    </>
  )
}
