import { Checkbox } from '../index'

export function Indeterminate() {
  return (
    <Checkbox.Root checked="indeterminate">
      <Checkbox.Label>Checkbox</Checkbox.Label>
      <Checkbox.Control data-testid="control">
        <Checkbox.Indicator>
          +
        </Checkbox.Indicator>
        <Checkbox.Indicator indeterminate>
          _
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
