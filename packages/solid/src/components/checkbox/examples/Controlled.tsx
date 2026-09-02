import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [checked, setChecked] = createSignal<Checkbox.CheckedState>(true)
  return (
    <Checkbox.Root checked={checked()} onCheckedChange={e => setChecked(e.checked)}>
      <Checkbox.Label>Checkbox</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
