import { useState } from 'react'
import { Checkbox } from '../index'

export function Controlled() {
  const [checked, setChecked] = useState<Checkbox.CheckedState>(true)

  return (
    <>
      {String(checked)}
      <Checkbox.Root checked={checked} onCheckedChange={e => setChecked(e.checked)}>
        <Checkbox.Label>Checkbox</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>
            x
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
    </>
  )
}
