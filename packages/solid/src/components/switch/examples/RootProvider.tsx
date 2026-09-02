import { Switch, useSwitch } from '@destyler-ui/solid/switch'

export function RootProvider() {
  const switchApi = useSwitch()

  return (
    <>
      <button onClick={() => switchApi().toggleChecked()}>Toggle</button>

      <Switch.RootProvider value={switchApi}>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Label</Switch.Label>
        <Switch.HiddenInput />
      </Switch.RootProvider>
    </>
  )
}
