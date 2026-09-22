import { createSignal } from 'solid-js'
import type { Checkbox } from '../'
import { ComponentUnderTest } from './basic'

export function ControlledComponentUnderTest() {
  const [checked, setChecked] = createSignal<Checkbox.CheckedState>(false)
  return (
    <>
      <button type="button" onClick={() => setChecked(true)}>
        set checked
      </button>
      <ComponentUnderTest checked={checked()} onCheckedChange={e => setChecked(e.checked)} />
    </>
  )
}
