import { useState } from 'react'
import { Switch } from '../index'

export function Controlled() {
  const [checked, setChecked] = useState(true)

  return (
    <Switch.Root checked={checked} onCheckedChange={(e) => setChecked(e.checked)}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>Label</Switch.Label>
      <Switch.HiddenInput />
    </Switch.Root>
  )
}
