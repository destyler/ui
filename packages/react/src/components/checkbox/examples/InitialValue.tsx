import { Checkbox } from '../index'

export function InitialValue(props: Checkbox.RootProps) {
  return (
    <Checkbox.Root {...props} defaultChecked>
      <Checkbox.Label>Checkbox</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>
          x
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
