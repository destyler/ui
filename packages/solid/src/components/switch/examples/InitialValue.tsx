import { Switch } from '@destyler-ui/solid/switch'

export function InitialValue() {
  return (
    <Switch.Root checked>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>Label</Switch.Label>
      <Switch.HiddenInput />
    </Switch.Root>
  )
}
