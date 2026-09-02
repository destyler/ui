import { Switch } from '@destyler-ui/solid/switch'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [checked, setChecked] = createSignal(false)

  return (
    <Switch.Root checked={checked()} onCheckedChange={e => setChecked(e.checked)}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>Label</Switch.Label>
      <Switch.HiddenInput />
    </Switch.Root>
  )
}
