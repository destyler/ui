import { useState } from 'react'
import { Toggle } from '../index'

export function Controlled() {
  const [pressed, setPressed] = useState(false)

  return (
    <>
      <output>{String(pressed)}</output>
      <Toggle.Root pressed={pressed} onPressedChange={setPressed}>
        <Toggle.Indicator>✓</Toggle.Indicator>
        Toggle
      </Toggle.Root>
    </>
  )
}
