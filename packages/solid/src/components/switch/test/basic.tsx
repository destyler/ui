import { Switch } from '../'

export function ComponentUnderTest(props: Switch.RootProps) {
  return (
    <Switch.Root {...props}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>Label</Switch.Label>
      <Switch.HiddenInput />
    </Switch.Root>
  )
}
