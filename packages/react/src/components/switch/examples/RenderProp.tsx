import { Switch } from '../index'

export function RenderProp() {
  return (
    <Switch.Root>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Context>
        {(api) => (
          <Switch.Label>Feature is {api.checked ? 'enabled' : 'disabled'}</Switch.Label>
        )}
      </Switch.Context>
      <Switch.HiddenInput />
    </Switch.Root>
  )
}
