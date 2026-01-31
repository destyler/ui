import { Checkbox } from '../index'

export function Basic(props: Checkbox.RootProps) {
  return (
    <Checkbox.Root {...props}>
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
