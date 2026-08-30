import { Switch } from '@destyler-ui/solid/switch'

export function RenderProp() {
  return (
    <Switch.Root>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Context>
        {context => (
          <Switch.Label>Feature is {context().checked ? 'enabled' : 'disabled'}</Switch.Label>
        )}
      </Switch.Context>
      <Switch.HiddenInput />
    </Switch.Root>
  )
}
